'use client';

import IntlMessageFormat from 'intl-messageformat';
import { createContext, use, useMemo } from 'react';
import { useLocale } from 'react-aria';

// Strings of the domain components in German and English as ICU messages. The locale comes from
// the nearest I18nProvider, so the components need no i18n library of the app. Values are formatted
// by the caller (money, times) and passed in as variables; counts go in as numbers for plurals.
// Editors can override any message (backoffice, journal record 042): the app passes the overrides
// to UiStringsProvider, and they win over the defaults below.

type Variables = Record<string, string | number>;
export type UiLanguage = 'de' | 'en';

const de: Record<string, string> = {
    'price.previous': 'Vorher',
    'rating.label': 'Bewertung {value} von 5',
    'spice.0': 'Mild',
    'spice.1': 'Leicht scharf',
    'spice.2': 'Scharf',
    'spice.3': 'Sehr scharf',
    'status.open': 'Jetzt geöffnet',
    'status.closed': 'Geschlossen',
    'status.opensAt': 'Geschlossen · öffnet um {time}',
    'delivery.minutes': '{minutes} Min.',
    'delivery.free': 'Gratis-Lieferung',
    'delivery.fee': 'Lieferung {fee}',
    'order.minimum': 'Mindestbestellwert {amount}',
    'dish.add': '{name} in den Warenkorb',
    'dish.soldOut': 'Ausverkauft',
    'dish.calories': '{calories} kcal, die du nicht isst',
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
    'mood.cheesy': 'Käsig',
    'mood.classic': 'Klassiker',
    'mood.comfort': 'Seelenfutter',
    'mood.creamy': 'Cremig',
    'mood.crispy': 'Knusprig',
    'mood.fresh': 'Frisch',
    'mood.hearty': 'Herzhaft',
    'mood.light': 'Leicht',
    'mood.salty': 'Salzig',
    'mood.sharable': 'Zum Teilen',
    'mood.spicy': 'Scharf',
    'mood.sweet': 'Süß',
    'mood.umami': 'Umami',
    'search.label': 'Gerichte und Restaurants suchen',
    'search.dish': 'Gericht',
    'search.restaurant': 'Restaurant',
    'map.pickup': 'Restaurant',
    'map.dropOff': 'Lieferadresse',
    'map.courier': 'Kurier',
    'map.unavailable': 'Die Karte braucht WebGL2, das dieser Browser nicht hat. Alles andere funktioniert.',
    'order.PLACED': 'Bestellt',
    'order.ACCEPTED': 'Kurier gefunden',
    'order.COOKING': 'In der Küche',
    'order.PICKED_UP': 'Abgeholt',
    'order.EN_ROUTE': 'Unterwegs',
    'order.DELIVERED': 'Nichts ist da',
    'order.steps': 'Bestellstatus',
    'deal.badge': '−{percent} %',
    'deal.ends': 'noch {time}',
    'deal.label': 'Blitzdeal: {percent} % günstiger, endet in {time}',
    'deal.over': 'Deal vorbei',
    'xp.level': 'Level {level}',
    'xp.value': '{into} von {needed} XP bis Level {next}',
    'streak.days': '{days, plural, one {# Tag in Folge} other {# Tage in Folge}}',
    'streak.none': 'Noch keine Serie',
    'streak.today': 'Heute schon bestellt',
    'streak.keep': 'Bestell heute, sonst ist die Serie weg',
    'chat.you': 'Du',
    'chat.coach': 'Craving Coach',
    'chat.typing': 'Der Craving Coach denkt nach',
    'badge.locked': 'Noch nicht verdient',
    'badge.earned': 'Verdient am {date}',
    'badge.tier.BRONZE': 'Bronze',
    'badge.tier.SILVER': 'Silber',
    'badge.tier.GOLD': 'Gold',
    'stamps.label': 'Stempelkarte {restaurant}: {stamps} von {perCard} Stempeln',
    'stamps.reward': 'Volle Karte: ein Gericht gratis',
    'stamps.completed': '{count, plural, one {# Karte voll} other {# Karten voll}}',
    'coupon.PERCENT': '{value} % Rabatt',
    'coupon.AMOUNT': '{amount} Rabatt',
    'coupon.FREE_DELIVERY': 'Lieferung gratis',
    'coupon.FREE_DISH': 'Ein Gericht gratis',
    'coupon.max': 'bis {amount}',
    'coupon.minimum': 'ab {amount}',
    'coupon.only': 'nur bei {restaurant}',
    'coupon.expires': 'gültig bis {date}',
    'coupon.copy': 'Code {code} kopieren',
    'coupon.copied': 'Kopiert',
    'wheel.label': 'Glücksrad',
    'wheel.PERCENT_10': '10 %',
    'wheel.PERCENT_20': '20 %',
    'wheel.AMOUNT_5': '5 €',
    'wheel.FREE_DELIVERY': 'Lieferung',
    'wheel.FREE_DISH': 'Gericht',
    'wheel.BONUS_XP': '+100 XP',
    'wheel.GOLDEN_FORK': 'Gabel',
    'wheel.result': 'Gewonnen: {prize}',
    'article.published': 'Erschienen am {date}',
};

const en: typeof de = {
    'price.previous': 'Previously',
    'rating.label': 'Rated {value} out of 5',
    'spice.0': 'Mild',
    'spice.1': 'Mildly spicy',
    'spice.2': 'Spicy',
    'spice.3': 'Very spicy',
    'status.open': 'Open now',
    'status.closed': 'Closed',
    'status.opensAt': 'Closed · opens at {time}',
    'delivery.minutes': '{minutes} min',
    'delivery.free': 'Free delivery',
    'delivery.fee': 'Delivery {fee}',
    'order.minimum': 'Minimum order {amount}',
    'dish.add': 'Add {name} to cart',
    'dish.soldOut': 'Sold out',
    'dish.calories': '{calories} kcal you won\'t eat',
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
    'mood.cheesy': 'Cheesy',
    'mood.classic': 'Classic',
    'mood.comfort': 'Comfort food',
    'mood.creamy': 'Creamy',
    'mood.crispy': 'Crispy',
    'mood.fresh': 'Fresh',
    'mood.hearty': 'Hearty',
    'mood.light': 'Light',
    'mood.salty': 'Salty',
    'mood.sharable': 'To share',
    'mood.spicy': 'Spicy',
    'mood.sweet': 'Sweet',
    'mood.umami': 'Umami',
    'search.label': 'Search dishes and restaurants',
    'search.dish': 'Dish',
    'search.restaurant': 'Restaurant',
    'map.pickup': 'Restaurant',
    'map.dropOff': 'Drop-off',
    'map.courier': 'Courier',
    'map.unavailable': 'The map needs WebGL2, which this browser lacks. Everything else works.',
    'order.PLACED': 'Ordered',
    'order.ACCEPTED': 'Courier found',
    'order.COOKING': 'In the kitchen',
    'order.PICKED_UP': 'Picked up',
    'order.EN_ROUTE': 'On the way',
    'order.DELIVERED': 'Nothing has arrived',
    'order.steps': 'Order status',
    'deal.badge': '−{percent}%',
    'deal.ends': '{time} left',
    'deal.label': 'Flash deal: {percent}% off, ends in {time}',
    'deal.over': 'Deal over',
    'xp.level': 'Level {level}',
    'xp.value': '{into} of {needed} XP to level {next}',
    'streak.days': '{days, plural, one {# day in a row} other {# days in a row}}',
    'streak.none': 'No streak yet',
    'streak.today': 'Ordered today',
    'streak.keep': 'Order today or the streak is gone',
    'chat.you': 'You',
    'chat.coach': 'Craving Coach',
    'chat.typing': 'The Craving Coach is thinking',
    'badge.locked': 'Not earned yet',
    'badge.earned': 'Earned on {date}',
    'badge.tier.BRONZE': 'Bronze',
    'badge.tier.SILVER': 'Silver',
    'badge.tier.GOLD': 'Gold',
    'stamps.label': 'Stamp card {restaurant}: {stamps} of {perCard} stamps',
    'stamps.reward': 'Full card: one dish free',
    'stamps.completed': '{count, plural, one {# card filled} other {# cards filled}}',
    'coupon.PERCENT': '{value}% off',
    'coupon.AMOUNT': '{amount} off',
    'coupon.FREE_DELIVERY': 'Free delivery',
    'coupon.FREE_DISH': 'One dish free',
    'coupon.max': 'up to {amount}',
    'coupon.minimum': 'from {amount}',
    'coupon.only': 'only at {restaurant}',
    'coupon.expires': 'valid until {date}',
    'coupon.copy': 'Copy code {code}',
    'coupon.copied': 'Copied',
    'wheel.label': 'Wheel of fortune',
    'wheel.PERCENT_10': '10%',
    'wheel.PERCENT_20': '20%',
    'wheel.AMOUNT_5': '€5',
    'wheel.FREE_DELIVERY': 'Delivery',
    'wheel.FREE_DISH': 'Dish',
    'wheel.BONUS_XP': '+100 XP',
    'wheel.GOLDEN_FORK': 'Fork',
    'wheel.result': 'You won: {prize}',
    'article.published': 'Published on {date}',
};

/** The default messages, also published by the app so the backoffice knows every key. */
export const UI_STRINGS: Record<UiLanguage, Record<string, string>> = { de, en };

const OverridesContext = createContext<Partial<Record<UiLanguage, Record<string, string>>>>({});

export interface UiStringsProviderProps {
    /** Messages editors changed, per language; keys as in [UI_STRINGS]. */
    overrides: Partial<Record<UiLanguage, Record<string, string>>>;
    children: React.ReactNode;
}

export function UiStringsProvider({ overrides, children }: UiStringsProviderProps) {
    return <OverridesContext value={overrides}>{children}</OverridesContext>;
}

export function useStrings() {
    const { locale } = useLocale();
    const language: UiLanguage = locale.toLowerCase().startsWith('en')
        ? 'en'
        : 'de';
    const overrides = use(OverridesContext)[language];
    return useMemo(() => {
        const formats = new Map<string, IntlMessageFormat>();
        const format = (key: string, variables?: Variables): string => {
            const fallback = UI_STRINGS[language][key] ?? key;
            const message = overrides?.[key] ?? fallback;
            try {
                let compiled = formats.get(key);
                if (!compiled) {
                    compiled = new IntlMessageFormat(message, locale);
                    formats.set(key, compiled);
                }
                return String(compiled.format(variables));
            }
            catch {
                // A broken override must not break the shop: back to the default wording.
                return String(new IntlMessageFormat(fallback, locale).format(variables));
            }
        };
        return {
            format,
            /** A label for a tag-like value, or the value itself when there is no translation. */
            label: (prefix: string, value: string) => {
                const key = `${prefix}.${value}`;
                return key in UI_STRINGS[language]
                    ? format(key)
                    : value.replaceAll('_', ' ');
            },
        };
    }, [language, locale, overrides]);
}

/** Labels of catalog values (cuisines, diet tags, allergens, moods, spice levels) in the current locale, for apps. */
export function useCatalogLabels() {
    const strings = useStrings();
    return {
        cuisine: (slug: string) => strings.label('cuisine', slug),
        dietary: (tag: string) => strings.label('dietary', tag),
        allergen: (allergen: string) => strings.label('allergen', allergen),
        mood: (mood: string) => strings.label('mood', mood),
        spice: (level: number) => strings.label('spice', String(level)),
    };
}
