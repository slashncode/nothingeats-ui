import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { bigNothing, chanaMasala, margherita, vindaloo } from '../../stories/fixtures';
import { DishCard } from './DishCard';

const meta = {
    title: 'Domain/DishCard',
    component: DishCard,
    args: {
        dish: margherita,
        onAdd: fn(),
    },
    parameters: { width: 460 },
    decorators: [
        (Story, { parameters }) => <div style={{ width: parameters.width as number | string }}><Story /></div>,
    ],
} satisfies Meta<typeof DishCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ args, canvasElement }) => {
        const card = within(canvasElement);
        await expect(card.getByText('Allergene: Gluten, Milch')).toBeInTheDocument();
        await userEvent.click(card.getByRole('button', { name: 'Margherita of Nothing in den Warenkorb' }));
        await expect(args.onAdd).toHaveBeenCalledWith(margherita);
    },
};

export const VeryHot: Story = {
    args: { dish: vindaloo },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('img', { name: 'Sehr scharf' })).toBeInTheDocument();
    },
};

export const Vegan: Story = {
    args: { dish: chanaMasala },
};

export const SoldOut: Story = {
    args: { dish: bigNothing },
    play: async ({ canvasElement }) => {
        const card = within(canvasElement);
        await expect(card.getByText('Ausverkauft')).toBeInTheDocument();
        await expect(card.queryByRole('button')).not.toBeInTheDocument();
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    args: { dish: bigNothing },
    play: async ({ canvasElement }) => {
        const card = within(canvasElement);
        await expect(card.getByText('1,100 kcal you won\'t eat')).toBeInTheDocument();
        await expect(card.getByText('Sold out')).toBeInTheDocument();
    },
};

export const Menu: Story = {
    render: args => (
        <div style={{ display: 'grid', gap: 12 }}>
            {[
                margherita,
                vindaloo,
                chanaMasala,
                bigNothing,
            ].map(dish => (
                <DishCard key={dish.id} {...args} dish={dish} />
            ))}
        </div>
    ),
};

/** Runs the accessibility checks (contrast included) against the dark theme too. */
export const MenuDark: Story = {
    ...Menu,
    globals: { theme: 'dark' },
};

export const WithRestaurant: Story = {
    args: {
        restaurant: { name: 'Phantom Pizza', href: '/restaurants/phantom-pizza' },
    },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('link', { name: 'Phantom Pizza' })).toHaveAttribute('href', '/restaurants/phantom-pizza');
    },
};
