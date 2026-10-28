import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Button } from '../../soren/ui/Button/Button';
import { CouponCard } from './CouponCard';

const meta = {
    title: 'Rewards/CouponCard',
    component: CouponCard,
    args: {
        coupon: {
            code: 'NE-7KQ3-M9XD',
            kind: 'PERCENT',
            value: 20,
            maxDiscountCents: 1000,
            minimumOrderCents: 2500,
            restaurant: null,
            expiresAt: '2026-12-02T11:00:00Z',
        },
    },
} satisfies Meta<typeof CouponCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Percent: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole('heading', { name: /^20 % Rabatt \(bis 10,00\s€\)$/ })).toBeInTheDocument();
        await expect(canvas.getByText(/^ab 25,00\s€$/)).toBeInTheDocument();
        await expect(canvas.getByRole('button', { name: 'Code NE-7KQ3-M9XD kopieren' })).toBeInTheDocument();
    },
};

export const FreeDishAtOneRestaurant: Story = {
    globals: { locale: 'en-US' },
    args: {
        coupon: {
            code: 'NE-2345-6789',
            kind: 'FREE_DISH',
            value: 0,
            maxDiscountCents: 1500,
            minimumOrderCents: 0,
            restaurant: { slug: 'phantom-pizza', name: 'Phantom Pizza' },
            expiresAt: '2026-12-02T11:00:00Z',
        },
        action: <Button size="sm">Apply</Button>,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole('heading', { name: 'One dish free (up to €15.00)' })).toBeInTheDocument();
        await expect(canvas.getByText('only at Phantom Pizza')).toBeInTheDocument();
        await expect(canvas.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    },
};
