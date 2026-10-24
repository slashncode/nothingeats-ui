import type { Meta, StoryObj } from '@storybook/react-vite';

import { FoodCover } from '../components/FoodCover/FoodCover';
import { Logo } from '../components/Logo/Logo';
import { Button } from '../soren/ui/Button/Button';
import { TextField } from '../soren/ui/TextField/TextField';

const meta = {
    title: 'Brand',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Logos: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 24, justifyItems: 'start' }}>
            <Logo size="lg" />
            <Logo />
            <Logo size="sm" />
            <Logo size="lg" markOnly />
        </div>
    ),
};

const CUISINES = [
    'italian',
    'greek',
    'indian',
    'asian',
    'japanese',
    'american',
    'desserts',
    'hawaiian',
    'unknown',
];

export const FoodCovers: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: 12 }}>
            {CUISINES.map(cuisine => <FoodCover key={cuisine} cuisine={cuisine} />)}
        </div>
    ),
};

/** soren-ui base components under the NothingEats theme. */
export const ThemedSorenUi: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 16, width: 320 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button>Bestellen</Button>
                <Button variant="secondary">Später</Button>
                <Button variant="outline">Menü</Button>
                <Button variant="ghost">Abbrechen</Button>
            </div>
            <TextField label="E-Mail" type="email" placeholder="du@nothingeats.dev" />
        </div>
    ),
};
