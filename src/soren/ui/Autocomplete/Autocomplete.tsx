'use client';

import type { AutocompleteProps as RACAutocompleteProps } from 'react-aria-components';
import clsx from 'clsx';
import {
    Autocomplete as RACAutocomplete,
    useFilter,
} from 'react-aria-components';

import styles from './Autocomplete.module.scss';

export interface AutocompleteProps extends Omit<RACAutocompleteProps, 'filter'> {
    /**
     * Predicate deciding which collection items survive the current field text.
     * Defaults to a case-insensitive "contains" match.
     *
     * Pass `null` to disable collection filtering entirely. Do that whenever the
     * caller already filtered the items — React Aria calls the filter with the
     * field's *whole* text as the query, which is meaningless for a TokenField
     * (the text is the entire document, not the search term).
     */
    filter?: RACAutocompleteProps['filter'] | null;
    className?: string;
}

// Wraps a SearchField/TextField and a collection (Menu, ListBox, GridList, …),
// filtering the collection as the user types.
function Autocomplete({ filter, className, children, ...props }: AutocompleteProps) {
    const { contains } = useFilter({ sensitivity: 'base' });
    // RAC treats a nullish `filter` as "no filtering"; `null` opts back into that
    // after our `contains` default, `undefined` accepts the default.
    const resolvedFilter = filter === null ? undefined : filter ?? contains;

    return (
        <div className={clsx(styles.autocomplete, className)}>
            <RACAutocomplete filter={resolvedFilter} {...props}>
                {children}
            </RACAutocomplete>
        </div>
    );
}
Autocomplete.displayName = 'Autocomplete';

export { Autocomplete };
