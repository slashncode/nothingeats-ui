import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { OrderTimeline } from './OrderTimeline';

const times = {
    PLACED: '2026-10-26T12:00:00Z',
    ACCEPTED: '2026-10-26T12:00:01Z',
    COOKING: '2026-10-26T12:00:09Z',
    PICKED_UP: '2026-10-26T12:01:30Z',
    EN_ROUTE: '2026-10-26T12:01:37Z',
    DELIVERED: '2026-10-26T12:03:00Z',
};

const meta = {
    title: 'Domain/OrderTimeline',
    component: OrderTimeline,
    args: { status: 'EN_ROUTE', times },
    decorators: [
        Story => <div style={{ width: 320 }}><Story /></div>,
    ],
} satisfies Meta<typeof OrderTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnRoute: Story = {
    play: async ({ canvasElement }) => {
        const timeline = within(canvasElement);
        await expect(timeline.getByRole('list', { name: 'Bestellstatus' })).toBeInTheDocument();
        await expect(timeline.getByText('Unterwegs').closest('li')).toHaveAttribute('aria-current', 'step');
    },
};

export const Delivered: Story = {
    args: { status: 'DELIVERED' },
};

export const Dark: Story = {
    globals: { theme: 'dark' },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    args: { status: 'COOKING' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('In the kitchen').closest('li')).toHaveAttribute('aria-current', 'step');
    },
};
