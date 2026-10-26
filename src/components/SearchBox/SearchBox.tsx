'use client';

import type { Key } from 'react-aria-components';
import clsx from 'clsx';
import { Search, Store, UtensilsCrossed } from 'lucide-react';
import { VisuallyHidden } from 'react-aria';
import { ComboBox as RACComboBox, Text as RACText } from 'react-aria-components';

import { FieldGroup } from '../../soren/ui/Field/Field';
import { DropdownItem, DropdownListBox } from '../../soren/ui/ListBox/ListBox';
import { Popover } from '../../soren/ui/Popover/Popover';
import { Input } from '../../soren/ui/TextField/TextField';
import { useStrings } from '../strings';
import styles from './SearchBox.module.scss';

/** One completion, shaped like `/api/search/v1/suggestions`. */
export interface SearchSuggestion {
    text: string;
    kind: 'dish' | 'restaurant';
    /** Dish id or restaurant slug. */
    target: string;
    restaurantSlug: string;
}

export interface SearchBoxProps {
    ref?: React.RefObject<HTMLFormElement | null>;
    value: string;
    onChange: (value: string) => void;
    /** Completions for the current value; the caller fetches them. */
    suggestions: SearchSuggestion[];
    /** Enter without a highlighted suggestion: search for the text. */
    onSubmit: (text: string) => void;
    onSuggestion: (suggestion: SearchSuggestion) => void;
    placeholder?: string;
    className?: string;
}

const key = (suggestion: SearchSuggestion) => `${suggestion.kind}:${suggestion.target}`;

/**
 * A search field with completions for dishes and restaurants. Enter searches for the typed text
 * unless a suggestion is highlighted with the arrow keys; picking a suggestion calls
 * [onSuggestion] instead.
 */
function SearchBox({ ref, value, onChange, suggestions, onSubmit, onSuggestion, placeholder, className }: SearchBoxProps) {
    const strings = useStrings();

    function select(selected: Key | null) {
        const suggestion = suggestions.find(it => key(it) === selected);
        if (suggestion)
            onSuggestion(suggestion);
    }

    return (
        <form
            ref={ref}
            role="search"
            className={clsx(styles.form, className)}
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit(value);
            }}
            // React Aria keeps Enter for itself while the list is open. Without a highlighted
            // option (no aria-activedescendant), Enter means "search for what I typed".
            onKeyDownCapture={(event) => {
                const input = event.target as HTMLElement;
                if (event.key === 'Enter' && input.tagName === 'INPUT' && !input.getAttribute('aria-activedescendant')) {
                    event.preventDefault();
                    event.stopPropagation();
                    onSubmit(value);
                }
            }}
        >
            <RACComboBox
                aria-label={strings.format('search.label')}
                items={suggestions}
                inputValue={value}
                onInputChange={onChange}
                selectedKey={null}
                onSelectionChange={select}
                allowsCustomValue
                // Suggestions arrive after typing; React Aria only opens on input when items exist
                // at that moment. Opening on an empty list (hidden by CSS) lets them appear later.
                allowsEmptyCollection
                menuTrigger="input"
                className={styles.comboBox}
            >
                <FieldGroup className={styles.field}>
                    <Search aria-hidden className={styles.icon} />
                    <Input type="search" placeholder={placeholder} className={styles.input} />
                </FieldGroup>
                <Popover showArrow={false} className={styles.popover}>
                    <DropdownListBox<SearchSuggestion> className={styles.list}>
                        {suggestion => (
                            <DropdownItem id={key(suggestion)} textValue={suggestion.text} className={styles.item}>
                                {suggestion.kind === 'restaurant'
                                    ? <Store aria-hidden className={styles.kindIcon} />
                                    : <UtensilsCrossed aria-hidden className={styles.kindIcon} />}
                                <RACText slot="label">{suggestion.text}</RACText>
                                {/* The icon shows the kind; screen readers get it as the description. */}
                                <VisuallyHidden>
                                    <RACText slot="description">
                                        {strings.format(suggestion.kind === 'restaurant'
                                            ? 'search.restaurant'
                                            : 'search.dish')}
                                    </RACText>
                                </VisuallyHidden>
                            </DropdownItem>
                        )}
                    </DropdownListBox>
                </Popover>
            </RACComboBox>
        </form>
    );
}
SearchBox.displayName = 'SearchBox';

export { SearchBox };
