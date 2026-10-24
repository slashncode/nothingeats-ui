'use client';

import type { KeyboardProps } from 'react-aria';
import { useKeyboard } from 'react-aria';

/** Maps shortcut strings (e.g. `'Mod+s'`, `'Control+Shift+a'`) to handlers. */
export type KeyboardShortcuts = NonNullable<KeyboardProps['shortcuts']>;

export type KeyboardShortcutOptions = Pick<
    KeyboardProps,
    'isDisabled' | 'allowRepeats' | 'allowComposing'
>;

/**
 * Binds declarative keyboard shortcuts to a focusable element.
 *
 * Shortcut strings are `Modifier+Key`; modifiers are case-insensitive and order does
 * not matter. `Mod` means Command on Apple platforms and Control elsewhere. A handler
 * that returns nothing stops propagation and prevents the default; return `false` to
 * let both continue.
 *
 * These are **element-scoped** — spread the returned props onto the element that should
 * hear them. For app-wide shortcuts, spread them onto a focusable root container; the
 * hook never binds to `document` on your behalf.
 *
 * ```tsx
 * const keyboardProps = useKeyboardShortcuts({
 *     'Mod+s': () => save(),
 *     'Mod+k': () => setPaletteOpen(true),
 * });
 * return <div {...keyboardProps}>…</div>;
 * ```
 */
export function useKeyboardShortcuts(
    shortcuts: KeyboardShortcuts,
    options: KeyboardShortcutOptions = {},
) {
    const { keyboardProps } = useKeyboard({ ...options, shortcuts });
    return keyboardProps;
}

const KEY_SYMBOLS: Record<string, string> = {
    mod: '⌘',
    meta: '⌘',
    ctrl: '⌃',
    control: '⌃',
    alt: '⌥',
    shift: '⇧',
    enter: '↵',
    escape: '⎋',
    backspace: '⌫',
    delete: '⌦',
    tab: '⇥',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
};

const NON_APPLE_MODIFIERS: Record<string, string> = {
    mod: 'Ctrl',
    meta: 'Win',
    ctrl: 'Ctrl',
    control: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
};

function isApplePlatform() {
    // These components only run in `client:only` islands, but the helper is exported
    // and may be called during a server render — fall back to the non-Apple spelling.
    if (typeof navigator === 'undefined') {
        return false;
    }
    return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Renders a shortcut string for display: `'Mod+s'` becomes `⌘S` on Apple platforms and
 * `Ctrl+S` everywhere else. Pair with `MenuKeyboard` to label a menu item.
 */
export function formatKeyboardShortcut(shortcut: string): string {
    const apple = isApplePlatform();
    const parts = shortcut.split('+').map((part) => {
        const key = part.trim().toLowerCase();
        if (apple && KEY_SYMBOLS[key]) {
            return KEY_SYMBOLS[key];
        }
        if (NON_APPLE_MODIFIERS[key]) {
            return NON_APPLE_MODIFIERS[key];
        }
        return part.length === 1 ? part.toUpperCase() : part;
    });
    return apple ? parts.join('') : parts.join('+');
}
