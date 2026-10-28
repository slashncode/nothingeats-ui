import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { StampCard } from './StampCard';

const meta = {
    title: 'Rewards/StampCard',
    component: StampCard,
    args: {
        restaurantName: 'Phantom Pizza',
        stamps: 3,
        perCard: 5,
        completed: 1,
    },
} satisfies Meta<typeof StampCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Halfway: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole('list', { name: 'Stempelkarte Phantom Pizza: 3 von 5 Stempeln' })).toBeInTheDocument();
        await expect(canvas.getByText(/1 Karte voll/)).toBeInTheDocument();
    },
};

export const Fresh: Story = {
    globals: { locale: 'en-US' },
    args: { stamps: 0, completed: 0 },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Full card: one dish free')).toBeInTheDocument();
    },
};
