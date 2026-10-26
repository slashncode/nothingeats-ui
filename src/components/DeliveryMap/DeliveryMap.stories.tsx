import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MapPoint } from './DeliveryMap';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { DeliveryMap } from './DeliveryMap';

// No tiles in stories and tests: a plain background keeps them offline and deterministic.
const blank = {
    version: 8 as const,
    sources: {},
    layers: [
        {
            id: 'background',
            type: 'background' as const,
            paint: { 'background-color': '#efe9df' },
        },
    ],
};

const pizza: MapPoint = { latitude: 53.5503, longitude: 9.9667 };
const schanze: MapPoint = { latitude: 53.5636, longitude: 9.9654 };

function line(from: MapPoint, to: MapPoint, steps = 12) {
    return Array.from({ length: steps + 1 }, (_, i) => ({
        latitude: from.latitude + (to.latitude - from.latitude) * (i / steps),
        longitude: from.longitude + (to.longitude - from.longitude) * (i / steps) + Math.sin((i / steps) * Math.PI) * 0.003,
    }));
}

const meta = {
    title: 'Domain/DeliveryMap',
    component: DeliveryMap,
    args: { label: 'Lieferkarte', mapStyle: blank },
    decorators: [
        Story => <div style={{ width: 520 }}><Story /></div>,
    ],
} satisfies Meta<typeof DeliveryMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tracking: Story = {
    args: {
        pickup: pizza,
        dropOff: schanze,
        courier: { latitude: 53.557, longitude: 9.968 },
        approachRoute: line({ latitude: 53.545, longitude: 9.975 }, pizza),
        deliveryRoute: line(pizza, schanze),
    },
    play: async ({ canvasElement }) => {
        const map = within(canvasElement);
        await expect(map.getByRole('region', { name: 'Lieferkarte' })).toBeInTheDocument();
        await waitFor(() => expect(map.getByRole('img', { name: 'Kurier' })).toBeInTheDocument());
        await expect(map.getByRole('img', { name: 'Restaurant' })).toBeInTheDocument();
        await expect(map.getByRole('img', { name: 'Lieferadresse' })).toBeInTheDocument();
    },
};

export const PickADropOff: Story = {
    args: {
        pickup: pizza,
        onPick: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = await waitFor(() => {
            const element = canvasElement.querySelector('.maplibregl-canvas');
            if (!element)
                throw new Error('map not rendered yet');
            return element;
        });
        await userEvent.click(canvas);
        await waitFor(() => expect(args.onPick).toHaveBeenCalledOnce());
        const [point] = (args.onPick as unknown as { mock: { calls: [{ latitude: number; longitude: number }][] } }).mock.calls[0]!;
        // Somewhere around Hamburg, where the map was centred.
        await expect(Math.round(point.latitude)).toBe(54);
        await expect(Math.round(point.longitude)).toBe(10);
    },
};

export const English: Story = {
    globals: { locale: 'en-US' },
    args: { label: 'Delivery map', pickup: pizza, dropOff: schanze },
    play: async ({ canvasElement }) => {
        await waitFor(() => expect(within(canvasElement).getByRole('img', { name: 'Drop-off' })).toBeInTheDocument());
    },
};
