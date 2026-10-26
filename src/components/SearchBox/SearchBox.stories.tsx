import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SearchSuggestion } from './SearchBox';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { SearchBox } from './SearchBox';

const all: SearchSuggestion[] = [
    {
        text: 'Phantom Pizza',
        kind: 'restaurant',
        target: 'phantom-pizza',
        restaurantSlug: 'phantom-pizza',
    },
    {
        text: 'Vegane Dampf-Pizza',
        kind: 'dish',
        target: 'd-1',
        restaurantSlug: 'phantom-pizza',
    },
    {
        text: 'Falafel-Phantom-Wrap',
        kind: 'dish',
        target: 'd-2',
        restaurantSlug: 'ghost-gyros',
    },
];

// The app fetches suggestions from the search API; here a prefix match over three fixtures.
function Controlled(props: { onSubmit: (text: string) => void; onSuggestion: (suggestion: SearchSuggestion) => void }) {
    const [value, setValue] = useState('');
    const suggestions = value.length < 2
        ? []
        : all.filter(it => it.text.toLowerCase().split(/[\s-]/).some(word => word.startsWith(value.toLowerCase())));
    return <SearchBox value={value} onChange={setValue} suggestions={suggestions} placeholder="Pizza, Pommes, Pho …" {...props} />;
}

const meta = {
    title: 'Domain/SearchBox',
    component: Controlled,
    args: {
        onSubmit: fn(),
        onSuggestion: fn(),
    },
    decorators: [
        Story => <div style={{ width: 420, minHeight: 220 }}><Story /></div>,
    ],
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnterSearchesForTheText: Story = {
    play: async ({ args, canvasElement }) => {
        const box = within(canvasElement);
        const input = box.getByRole('combobox', { name: 'Gerichte und Restaurants suchen' });
        await userEvent.type(input, 'phan');
        await waitFor(() => expect(within(document.body).getByRole('option', { name: /Phantom Pizza/ })).toBeInTheDocument());
        await userEvent.keyboard('{Enter}');
        await expect(args.onSubmit).toHaveBeenCalledWith('phan');
        await expect(args.onSuggestion).not.toHaveBeenCalled();
    },
};

export const ArrowKeysPickASuggestion: Story = {
    play: async ({ args, canvasElement }) => {
        const input = within(canvasElement).getByRole('combobox');
        await userEvent.type(input, 'phan');
        await waitFor(() => expect(within(document.body).getAllByRole('option')).toHaveLength(2));
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await expect(args.onSuggestion).toHaveBeenCalledWith(all[0]);
        await expect(args.onSubmit).not.toHaveBeenCalled();
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    play: async ({ canvasElement }) => {
        await userEvent.type(within(canvasElement).getByRole('combobox', { name: 'Search dishes and restaurants' }), 'pizz');
        await waitFor(() => expect(within(document.body).getByRole('option', { name: 'Vegane Dampf-Pizza' })).toHaveAccessibleDescription('Dish'));
    },
};

export const Dark: Story = {
    globals: { theme: 'dark' },
    play: async ({ canvasElement }) => {
        await userEvent.type(within(canvasElement).getByRole('combobox'), 'pizz');
        await waitFor(() => expect(within(document.body).getAllByRole('option')).toHaveLength(2));
    },
};
