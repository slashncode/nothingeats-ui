import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SpinWheelProps } from './SpinWheel';
import { useState } from 'react';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../../soren/ui/Button/Button';
import { SpinWheel } from './SpinWheel';

/** A spin button that plays the server: every press says "free delivery". */
function SpinDemo(props: SpinWheelProps) {
    const [result, setResult] = useState<string | null>(null);
    const [spin, setSpin] = useState(0);
    return (
        <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
            <SpinWheel {...props} result={result} spinId={spin} />
            <Button
                onPress={() => {
                    setResult('FREE_DELIVERY');
                    setSpin(spin + 1);
                }}
            >
                Drehen
            </Button>
        </div>
    );
}

const meta = {
    title: 'Rewards/SpinWheel',
    component: SpinWheel,
    args: {
        result: null,
        onSpinEnd: fn(),
    },
} satisfies Meta<typeof SpinWheel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Still: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole('img', { name: 'Glücksrad' })).toBeInTheDocument();
        await expect(canvas.getByText('Gericht')).toBeInTheDocument();
    },
};

/** The server says "free delivery"; the wheel turns there and reports when it stopped. */
export const Spinning: Story = {
    render: args => <SpinDemo {...args} />,
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByRole('button', { name: 'Drehen' }));
        await waitFor(() => expect(args.onSpinEnd).toHaveBeenCalledTimes(1), { timeout: 6000 });
        const disc = canvasElement.querySelector('svg g') as SVGGElement;
        // FREE_DELIVERY is the 2nd of 7 segments: its middle is 77.1° clockwise from the top.
        const degrees = Number.parseFloat(disc.style.transform.replace('rotate(', ''));
        await expect(degrees).toBeCloseTo(5 * 360 + 360 - 1.5 * (360 / 7), 1);
    },
};
