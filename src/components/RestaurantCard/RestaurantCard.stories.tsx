import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { airBurger, imaginaryIceCream, phantomPizza, restaurants } from '../../stories/fixtures';
import { RestaurantCard } from './RestaurantCard';

const meta = {
    title: 'Domain/RestaurantCard',
    component: RestaurantCard,
    args: { restaurant: phantomPizza, href: '/restaurants/phantom-pizza' },
    parameters: { width: 340 },
    decorators: [
        (Story, { parameters }) => <div style={{ width: parameters.width as number | string }}><Story /></div>,
    ],
} satisfies Meta<typeof RestaurantCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
    play: async ({ canvasElement }) => {
        const link = within(canvasElement).getByRole('link', { name: 'Phantom Pizza' });
        await expect(link).toHaveAttribute('href', '/restaurants/phantom-pizza');
    },
};

export const FreeDelivery: Story = {
    args: { restaurant: airBurger, href: '/restaurants/air-burger' },
};

export const Closed: Story = {
    args: { restaurant: imaginaryIceCream, href: '/restaurants/imaginary-ice-cream' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText(/13:00|1:00 PM/)).toBeInTheDocument();
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    play: async ({ canvasElement }) => {
        const card = within(canvasElement);
        await expect(card.getByText('Open now')).toBeInTheDocument();
        await expect(card.getByText('Delivery €1.99')).toBeInTheDocument();
    },
};

export const Grid: Story = {
    parameters: { width: 'min(1080px, 95vw)' },
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant.slug} restaurant={restaurant} href={`/restaurants/${restaurant.slug}`} headingLevel={2} />
            ))}
        </div>
    ),
};

/** Runs the accessibility checks (contrast included) against the dark theme too. */
export const GridDark: Story = {
    ...Grid,
    globals: { theme: 'dark' },
};
