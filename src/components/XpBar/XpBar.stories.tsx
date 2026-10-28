import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { XpBar } from './XpBar';

const meta = {
    title: 'Rewards/XpBar',
    component: XpBar,
    args: {
        level: 3,
        xp: 340,
        levelStartXp: 250,
        nextLevelXp: 450,
    },
} satisfies Meta<typeof XpBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const German: Story = {
    play: async ({ canvasElement }) => {
        const bar = within(canvasElement).getByRole('progressbar', { name: 'Level 3' });
        await expect(bar).toHaveAttribute('aria-valuetext', '90 von 200 XP bis Level 4');
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    args: {
        level: 1,
        xp: 0,
        levelStartXp: 0,
        nextLevelXp: 100,
    },
    play: async ({ canvasElement }) => {
        const bar = within(canvasElement).getByRole('progressbar', { name: 'Level 1' });
        await expect(bar).toHaveAttribute('aria-valuetext', '0 of 100 XP to level 2');
    },
};
