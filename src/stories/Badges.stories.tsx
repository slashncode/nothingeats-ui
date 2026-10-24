import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { DIETARY_TAGS } from '../components/catalog';
import { DietaryTags } from '../components/DietaryTags/DietaryTags';
import { OpenStatus } from '../components/OpenStatus/OpenStatus';
import { Rating } from '../components/Rating/Rating';
import { SpiceLevel } from '../components/SpiceLevel/SpiceLevel';

const meta = {
    title: 'Domain/Badges',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dietary: Story = {
    render: () => <DietaryTags tags={[...DIETARY_TAGS, 'paleo']} />,
    play: async ({ canvasElement }) => {
        const list = within(canvasElement).getByRole('list', { name: 'Ernährung' });
        await expect(within(list).getAllByRole('listitem')).toHaveLength(6);
        await expect(within(list).getByText('paleo')).toBeInTheDocument();
    },
};

export const Spice: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 8 }}>
            {[0, 1, 2, 3].map(level => <SpiceLevel key={level} level={level} />)}
        </div>
    ),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('img', { name: 'Leicht scharf' })).toBeInTheDocument();
    },
};

export const Ratings: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 16 }}>
            <Rating value={4.7} />
            <Rating value={3} />
        </div>
    ),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('img', { name: 'Bewertung 4,7 von 5' })).toBeInTheDocument();
    },
};

export const Status: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 8 }}>
            <OpenStatus open />
            <OpenStatus open={false} opensAt="18:00" />
            <OpenStatus open={false} />
        </div>
    ),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Geschlossen · öffnet um 18:00')).toBeInTheDocument();
    },
};

export const AllDark: Story = {
    globals: { theme: 'dark' },
    render: () => (
        <div style={{ display: 'grid', gap: 12 }}>
            <DietaryTags tags={[...DIETARY_TAGS]} />
            <SpiceLevel level={2} />
            <Rating value={4.2} />
            <OpenStatus open />
            <OpenStatus open={false} opensAt="18:00" />
        </div>
    ),
};
