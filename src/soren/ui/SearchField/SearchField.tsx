'use client';

import type {
    SearchFieldProps as RACSearchFieldProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import {
    composeRenderProps,
    Input as RACInput,
    SearchField as RACSearchField,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { Description, FieldError, FieldGroup, Label } from '../Field/Field';
import styles from './SearchField.module.scss';

export type SearchFieldSlots
    = | 'label'
        | 'fieldGroup'
        | 'input'
        | 'icon'
        | 'clearButton'
        | 'description'
        | 'errorMessage';

export interface SearchFieldProps extends RACSearchFieldProps {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    placeholder?: string;
    classNames?: Partial<Record<SearchFieldSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function SearchField({
    ref,
    label,
    description,
    errorMessage,
    placeholder,
    className,
    classNames,
    ...props
}: SearchFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <RACSearchField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.group, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <FieldGroup className={clsx(styles.inputGroup, classNames?.fieldGroup)}>
                <Search
                    aria-hidden
                    className={clsx(styles.icon, classNames?.icon)}
                    onClick={() => inputRef.current?.focus()}
                />
                <RACInput
                    ref={inputRef}
                    placeholder={placeholder}
                    className={clsx(styles.input, classNames?.input)}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Clear search"
                    className={clsx(styles.clearButton, classNames?.clearButton)}
                >
                    <X aria-hidden className={styles.clearIcon} />
                </Button>
            </FieldGroup>
            {description && (
                <Description className={clsx(styles.description, classNames?.description)}>
                    {description}
                </Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
        </RACSearchField>
    );
}
SearchField.displayName = 'SearchField';

export { SearchField };
