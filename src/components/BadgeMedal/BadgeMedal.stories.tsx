import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { BadgeMedal } from './BadgeMedal';

const meta = {
    title: 'Rewards/BadgeMedal',
    component: BadgeMedal,
    args: {
        badgeKey: 'night-owl',
        name: 'Nachteule',
        description: 'Zwischen 22 und 5 Uhr nichts bestellt.',
        tier: 'SILVER',
        earnedAt: '2026-11-02T22:14:00Z',
    },
} satisfies Meta<typeof BadgeMedal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Earned: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole('heading', { name: 'Nachteule' })).toBeInTheDocument();
        await expect(canvas.getByText(/Silber · Verdient am 02\.11\.2026/)).toBeInTheDocument();
    },
};

export const Locked: Story = {
    args: {
        badgeKey: 'golden-fork',
        name: 'Goldene Gabel',
        description: 'Der seltenste Gewinn am Glücksrad.',
        tier: 'GOLD',
        earnedAt: null,
    },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Gold · Noch nicht verdient')).toBeInTheDocument();
    },
};
