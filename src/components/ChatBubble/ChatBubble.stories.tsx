import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { ChatBubble } from './ChatBubble';

const meta = {
    title: 'Coach/ChatBubble',
    component: ChatBubble,
    args: { from: 'coach', children: 'Hier sind ein paar Ideen. Bestellen kostet nichts, und satt wirst du auch nicht.' },
    decorators: [
        Story => (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxWidth: '28rem',
            }}
            >
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Coach: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('Craving Coach')).toBeInTheDocument();
        await expect(canvas.getByText(/Bestellen kostet nichts/)).toBeVisible();
    },
};

export const Customer: Story = {
    args: { from: 'customer', children: 'Etwas Warmes für einen verregneten Abend' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Du')).toBeInTheDocument();
    },
};

export const Thinking: Story = {
    globals: { locale: 'en-US' },
    args: { pending: true, children: undefined },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('status')).toHaveTextContent('The Craving Coach is thinking');
    },
};
