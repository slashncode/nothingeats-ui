import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { article } from '../../stories/fixtures';
import { ArticleCard } from './ArticleCard';

const meta = {
    title: 'Domain/ArticleCard',
    component: ArticleCard,
    args: { article, href: '/articles/die-pizza-die-nie-kam' },
    parameters: { width: 340 },
    decorators: [
        (Story, { parameters }) => <div style={{ width: parameters.width as number | string }}><Story /></div>,
    ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const card = within(canvasElement);
        await expect(card.getByRole('link', { name: 'Die Pizza, die nie kam' })).toHaveAttribute('href', '/articles/die-pizza-die-nie-kam');
        await expect(card.getByText('Erschienen am 30. Oktober 2026')).toBeInTheDocument();
        await expect(card.getByText('Geschichten')).toBeInTheDocument();
    },
};

/** Without a cover: a plate of nothing. */
export const WithoutCover: Story = {
    args: {
        article: { ...article, cover: null, category: null },
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Published on October 30, 2026')).toBeInTheDocument();
    },
};

/** Runs the accessibility checks (contrast included) against the dark theme too. */
export const Dark: Story = {
    globals: { theme: 'dark' },
};
