'use client';

import type { LocalizedStrings } from '@internationalized/string';
import { useLocalizedStringFormatter } from 'react-aria';

// Strings of the domain components in German and English, the React Aria way: the locale comes
// from the nearest I18nProvider, so the components need no i18n library of the app.
// Values are formatted by the caller (numbers, money, times) and passed in as variables.

type Variables = Record<string, string | number>;
type Message = string | ((variables: Variables) => string);

const de: Record<string, Message> = {
    'price.previous': 'Vorher',
    'rating.label': v => `Bewertung ${v.value} von 5`,
    'spice.0': 'Mild',
    'spice.1': 'Leicht scharf',
    'spice.2': 'Scharf',
    'spice.3': 'Sehr scharf',
    'status.open': 'Jetzt geöffnet',
    'status.closed': 'Geschlossen',
    'status.opensAt': v => `Geschlossen · öffnet um ${v.time}`,
    'delivery.minutes': v => `${v.minutes} Min.`,
    'delivery.free': 'Gratis-Lieferung',
    'delivery.fee': v => `Lieferung ${v.fee}`,
    'order.minimum': v => `Mindestbestellwert ${v.amount}`,
    'dish.add': v => `${v.name} in den Warenkorb`,
    'dish.soldOut': 'Ausverkauft',
    'dish.calories': v => `${v.calories} kcal, die du nicht isst`,
    'dish.allergens': 'Allergene',
    'dietary.label': 'Ernährung',
    'dietary.vegan': 'Vegan',
    'dietary.vegetarian': 'Vegetarisch',
    'dietary.gluten_free': 'Glutenfrei',
    'dietary.lactose_free': 'Laktosefrei',
    'dietary.halal': 'Halal',
    'allergen.gluten': 'Gluten',
    'allergen.crustaceans': 'Krebstiere',
    'allergen.eggs': 'Eier',
    'allergen.fish': 'Fisch',
    'allergen.peanuts': 'Erdnüsse',
    'allergen.soybeans': 'Soja',
    'allergen.milk': 'Milch',
    'allergen.nuts': 'Schalenfrüchte',
    'allergen.celery': 'Sellerie',
    'allergen.mustard': 'Senf',
    'allergen.sesame': 'Sesam',
    'allergen.sulphites': 'Sulfite',
    'allergen.lupin': 'Lupinen',
    'allergen.molluscs': 'Weichtiere',
    'cuisine.american': 'Amerikanisch',
    'cuisine.asian': 'Asiatisch',
    'cuisine.desserts': 'Desserts',
    'cuisine.greek': 'Griechisch',
    'cuisine.hawaiian': 'Hawaiianisch',
    'cuisine.indian': 'Indisch',
    'cuisine.italian': 'Italienisch',
    'cuisine.japanese': 'Japanisch',
};

const en: typeof de = {
    'price.previous': 'Previously',
    'rating.label': v => `Rated ${v.value} out of 5`,
    'spice.0': 'Mild',
    'spice.1': 'Mildly spicy',
    'spice.2': 'Spicy',
    'spice.3': 'Very spicy',
    'status.open': 'Open now',
    'status.closed': 'Closed',
    'status.opensAt': v => `Closed · opens at ${v.time}`,
    'delivery.minutes': v => `${v.minutes} min`,
    'delivery.free': 'Free delivery',
    'delivery.fee': v => `Delivery ${v.fee}`,
    'order.minimum': v => `Minimum order ${v.amount}`,
    'dish.add': v => `Add ${v.name} to cart`,
    'dish.soldOut': 'Sold out',
    'dish.calories': v => `${v.calories} kcal you won't eat`,
    'dish.allergens': 'Allergens',
    'dietary.label': 'Diet',
    'dietary.vegan': 'Vegan',
    'dietary.vegetarian': 'Vegetarian',
    'dietary.gluten_free': 'Gluten-free',
    'dietary.lactose_free': 'Lactose-free',
    'dietary.halal': 'Halal',
    'allergen.gluten': 'Gluten',
    'allergen.crustaceans': 'Crustaceans',
    'allergen.eggs': 'Eggs',
    'allergen.fish': 'Fish',
    'allergen.peanuts': 'Peanuts',
    'allergen.soybeans': 'Soy',
    'allergen.milk': 'Milk',
    'allergen.nuts': 'Tree nuts',
    'allergen.celery': 'Celery',
    'allergen.mustard': 'Mustard',
    'allergen.sesame': 'Sesame',
    'allergen.sulphites': 'Sulphites',
    'allergen.lupin': 'Lupin',
    'allergen.molluscs': 'Molluscs',
    'cuisine.american': 'American',
    'cuisine.asian': 'Asian',
    'cuisine.desserts': 'Desserts',
    'cuisine.greek': 'Greek',
    'cuisine.hawaiian': 'Hawaiian',
    'cuisine.indian': 'Indian',
    'cuisine.italian': 'Italian',
    'cuisine.japanese': 'Japanese',
};

const strings = { 'de-DE': de, 'en-US': en } as unknown as LocalizedStrings<string, string>;

export function useStrings() {
    const formatter = useLocalizedStringFormatter(strings, '@slashncode/nothingeats-ui');
    return {
        format: (key: string, variables?: Variables) => formatter.format(key, variables),
        /** A label for a tag-like value, or the value itself when there is no translation. */
        label: (prefix: string, value: string) => {
            const key = `${prefix}.${value}`;
            return key in de
                ? formatter.format(key)
                : value.replaceAll('_', ' ');
        },
    };
}

/** Labels of catalog values (cuisines, diet tags, allergens) in the current locale, for apps. */
export function useCatalogLabels() {
    const strings = useStrings();
    return {
        cuisine: (slug: string) => strings.label('cuisine', slug),
        dietary: (tag: string) => strings.label('dietary', tag),
        allergen: (allergen: string) => strings.label('allergen', allergen),
    };
}
