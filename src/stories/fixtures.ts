import type { DishSummary, RestaurantSummary } from '../components/catalog';

// Taken from the catalog service's seed (nothingeats-catalog-service, seed/catalog.json).

export const phantomPizza: RestaurantSummary = {
    slug: 'phantom-pizza',
    name: 'Phantom Pizza',
    description: 'Neapolitan pizza from a stone oven that is never lit. Zero crumbs on the couch since 2026.',
    cuisine: 'italian',
    rating: 4.7,
    deliveryMinutes: 30,
    deliveryFeeCents: 199,
    minimumOrderCents: 1200,
    openNow: true,
    opensAt: '11:00',
    closesAt: '23:00',
};

export const airBurger: RestaurantSummary = {
    slug: 'air-burger',
    name: 'Air Burger',
    description: 'Smash burgers with a sear that only sizzles in your head. Open until 2 a.m.',
    cuisine: 'american',
    rating: 4.3,
    deliveryMinutes: 30,
    deliveryFeeCents: 0,
    minimumOrderCents: 1500,
    openNow: true,
    opensAt: '11:00',
    closesAt: '02:00',
};

export const imaginaryIceCream: RestaurantSummary = {
    slug: 'imaginary-ice-cream',
    name: 'Imaginary Ice Cream',
    description: 'Handmade ice cream from Eppendorf that never melts, because it never arrives.',
    cuisine: 'desserts',
    rating: 4.9,
    deliveryMinutes: 20,
    deliveryFeeCents: 149,
    minimumOrderCents: 1000,
    openNow: false,
    opensAt: '13:00',
    closesAt: '21:00',
};

export const restaurants = [phantomPizza, airBurger, imaginaryIceCream];

export const margherita: DishSummary = {
    id: '0198f4a2-0000-7000-8000-000000000001',
    slug: 'margherita-of-nothing',
    name: 'Margherita of Nothing',
    description: 'San Marzano tomatoes, fior di latte and basil, imagined by you.',
    priceCents: 1090,
    dietary: ['vegetarian'],
    allergens: ['gluten', 'milk'],
    spiceLevel: 0,
    calories: 820,
    moods: ['cheesy', 'comfort', 'classic'],
    available: true,
};

export const vindaloo: DishSummary = {
    id: '0198f4a2-0000-7000-8000-000000000002',
    slug: 'lamb-vindaloo-from-the-void',
    name: 'Lamb Vindaloo from the Void',
    description: 'Fiery hot with vinegar and potatoes. Your stomach stays calm anyway.',
    priceCents: 1590,
    dietary: ['gluten_free', 'lactose_free'],
    allergens: ['mustard'],
    spiceLevel: 3,
    calories: 890,
    moods: ['spicy', 'hearty'],
    available: true,
};

export const bigNothing: DishSummary = {
    id: '0198f4a2-0000-7000-8000-000000000003',
    slug: 'the-big-nothing',
    name: 'The Big Nothing',
    description: 'Double beef, cheddar, pickles and house mayo. 1100 calories you never eat.',
    priceCents: 1490,
    dietary: [],
    allergens: [
        'gluten',
        'milk',
        'eggs',
        'mustard',
        'sesame',
    ],
    spiceLevel: 0,
    calories: 1100,
    moods: ['cheesy', 'hearty', 'comfort'],
    available: false,
};

export const chanaMasala: DishSummary = {
    id: '0198f4a2-0000-7000-8000-000000000004',
    slug: 'chana-masala-mirage',
    name: 'Chana Masala Mirage',
    description: 'Chickpeas in spiced tomato sauce. Warms you without a plate.',
    priceCents: 1190,
    dietary: ['vegan', 'gluten_free'],
    allergens: [],
    spiceLevel: 2,
    calories: 610,
    moods: ['spicy', 'comfort', 'hearty'],
    available: true,
};
