import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { StreakFlame } from './StreakFlame';

const meta = {
    title: 'Rewards/StreakFlame',
    component: StreakFlame,
    args: { days: 4, orderedToday: true },
} satisfies Meta<typeof StreakFlame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Burning: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('4 Tage in Folge')).toBeInTheDocument();
        await expect(canvas.getByText('Heute schon bestellt')).toBeInTheDocument();
    },
};

export const AtRisk: Story = {
    args: { days: 1, orderedToday: false },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Bestell heute, sonst ist die Serie weg')).toBeInTheDocument();
    },
};

export const Out: Story = {
    globals: { locale: 'en-US' },
    args: { days: 0, orderedToday: false },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('No streak yet')).toBeInTheDocument();
    },
};
