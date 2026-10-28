import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { DealBadge } from './DealBadge';

const now = Date.parse('2026-11-02T11:00:00Z');
const fixed = () => now;

const meta = {
    title: 'Domain/DealBadge',
    component: DealBadge,
    args: { percentOff: 30, endsAt: '2026-11-02T11:12:34Z', now: fixed },
} satisfies Meta<typeof DealBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('−30 %')).toBeInTheDocument();
        await expect(canvas.getByText('noch 12:34')).toBeInTheDocument();
        await expect(canvas.getByText('Blitzdeal: 30 % günstiger, endet in 13 Minuten')).toBeInTheDocument();
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    args: { endsAt: '2026-11-02T12:01:05Z' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('1:01:05 left')).toBeInTheDocument();
    },
};

export const Over: Story = {
    args: { endsAt: '2026-11-02T10:59:00Z' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getAllByText('Deal vorbei')).toHaveLength(2);
    },
};
