// View models of the catalog API (`/api/catalog/v1`), already in the caller's language.
// Tags arrive as lowercase strings; unknown values are shown as they come.

export interface RestaurantSummary {
    slug: string;
    name: string;
    description: string;
    cuisine: string;
    rating: number;
    deliveryMinutes: number;
    deliveryFeeCents: number;
    minimumOrderCents: number;
    openNow: boolean;
    /** `HH:mm`, Berlin time */
    opensAt: string;
    closesAt: string;
}

export interface DishSummary {
    id: string;
    slug: string;
    name: string;
    description: string;
    priceCents: number;
    dietary: string[];
    allergens: string[];
    spiceLevel: number;
    calories: number;
    moods: string[];
    available: boolean;
    /** A running flash deal: the dish costs [priceCents] until [endsAt] (ISO). */
    deal?: DealSummary | null;
}

export interface DealSummary {
    priceCents: number;
    percentOff: number;
    endsAt: string;
}

export const DIETARY_TAGS = [
    'vegan',
    'vegetarian',
    'gluten_free',
    'lactose_free',
    'halal',
] as const;
export type DietaryTag = (typeof DIETARY_TAGS)[number];

/** Moods the catalog tags dishes with; search filters and facets use the same keys. */
export const MOODS = [
    'cheesy',
    'classic',
    'comfort',
    'creamy',
    'crispy',
    'fresh',
    'hearty',
    'light',
    'salty',
    'sharable',
    'spicy',
    'sweet',
    'umami',
] as const;
export type Mood = (typeof MOODS)[number];

/** The 14 allergens that EU law requires restaurants to declare. */
export const ALLERGENS = [
    'gluten',
    'crustaceans',
    'eggs',
    'fish',
    'peanuts',
    'soybeans',
    'milk',
    'nuts',
    'celery',
    'mustard',
    'sesame',
    'sulphites',
    'lupin',
    'molluscs',
] as const;
export type Allergen = (typeof ALLERGENS)[number];

interface CuisineLook {
    emoji: string;
    /** OKLCH hue of the cover background */
    hue: number;
}

const CUISINES: Record<string, CuisineLook> = {
    american: { emoji: '🍔', hue: 55 },
    asian: { emoji: '🍜', hue: 20 },
    desserts: { emoji: '🍨', hue: 340 },
    greek: { emoji: '🥙', hue: 230 },
    hawaiian: { emoji: '🥗', hue: 165 },
    indian: { emoji: '🍛', hue: 75 },
    italian: { emoji: '🍕', hue: 35 },
    japanese: { emoji: '🍣', hue: 5 },
};

export function cuisineLook(cuisine: string): CuisineLook {
    return CUISINES[cuisine] ?? { emoji: '🍽️', hue: 80 };
}

/** `HH:mm` as a Date today, only for formatting the time of day. */
export function timeOfDay(value: string): Date | undefined {
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    if (!match)
        return undefined;
    const date = new Date(2026, 0, 1);
    date.setHours(Number(match[1]), Number(match[2]), 0, 0);
    return date;
}
