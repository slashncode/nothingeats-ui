import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { PriceTag } from './PriceTag';

const meta = {
    title: 'Domain/PriceTag',
    component: PriceTag,
    args: { cents: 1090 },
    argTypes: {
        size: {
            control: 'inline-radio',
            options: ['sm', 'md', 'lg'],
        },
    },
} satisfies Meta<typeof PriceTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const German: Story = {
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('10,90 €')).toBeInTheDocument();
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('€10.90')).toBeInTheDocument();
    },
};

export const Discounted: Story = {
    args: { cents: 790, previousCents: 1090, size: 'lg' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Vorher', { exact: false })).toBeInTheDocument();
    },
};
