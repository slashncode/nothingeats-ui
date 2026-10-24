'use client';

import type {
    TokenFieldProps as RACTokenFieldProps,
    TokenInputProps as RACTokenInputProps,
    TokenProps as RACTokenProps,
} from 'react-aria-components';
import type {
    TokenFieldSegment,
    TokenFieldValueOptions,
} from 'react-stately/useTokenFieldState';

import clsx from 'clsx';
import * as React from 'react';
import {
    composeRenderProps,
    Token as RACToken,
    TokenField as RACTokenField,
    TokenInput as RACTokenInput,
    TokenFieldValue,
} from 'react-aria-components';

import { Description, Label } from '../Field/Field';
import styles from './TokenField.module.scss';

export type TokenFieldSlots
    = | 'field'
        | 'label'
        | 'input'
        | 'description'
        | 'errorMessage';

export interface TokenFieldProps<T extends TokenFieldValue = TokenFieldValue>
    extends Omit<RACTokenFieldProps<T>, 'children'> {
    label?: string;
    description?: string;
    /**
     * RAC's TokenField has no validation state, so this renders as a live region
     * associated via `aria-describedby` rather than a RAC `FieldError`.
     */
    errorMessage?: string;
    /** Shown while the field is empty. Rendered via CSS, since there is no `<input>`. */
    placeholder?: string;
    /** Renders one token per token segment. Text segments render as plain text. */
    children: RACTokenInputProps<T>['children'];
    /** Ref to the editable region — use as a `triggerRef` to anchor an autocomplete popover. */
    inputRef?: React.RefObject<HTMLDivElement | null>;
    classNames?: Partial<Record<TokenFieldSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

/**
 * A token field allows users to enter text with inline, non-editable tokens. Use it to
 * build AI prompt fields, tag inputs, structured search fields, mention inputs and
 * multi-select comboboxes.
 *
 * @version alpha — the underlying React Aria `TokenField` is alpha; its API may change
 * in a future minor release.
 */
function TokenField<T extends TokenFieldValue = TokenFieldValue>({
    ref,
    inputRef,
    label,
    description,
    errorMessage,
    placeholder,
    children,
    className,
    classNames,
    ...props
}: TokenFieldProps<T>) {
    const errorId = React.useId();
    // `useTokenField` funnels props through `useField`, so an `aria-describedby` set
    // here reaches the editable region. Preserve any the consumer already passed.
    const describedBy = [props['aria-describedby'], errorMessage ? errorId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <RACTokenField<T>
            ref={ref}
            {...props}
            aria-describedby={describedBy}
            className={composeRenderProps(className, className =>
                clsx(styles.tokenField, classNames?.field, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <RACTokenInput<T>
                ref={inputRef}
                data-placeholder={placeholder}
                className={clsx(styles.tokenInput, classNames?.input)}
            >
                {children}
            </RACTokenInput>
            {description && (
                <Description className={clsx(styles.description, classNames?.description)}>
                    {description}
                </Description>
            )}
            {errorMessage && (
                <span
                    id={errorId}
                    role="alert"
                    className={clsx(styles.errorMessage, classNames?.errorMessage)}
                >
                    {errorMessage}
                </span>
            )}
        </RACTokenField>
    );
}
TokenField.displayName = 'TokenField';

export interface TokenProps extends RACTokenProps {
    ref?: React.RefObject<HTMLSpanElement | null>;
}

/** A single inline token inside a {@link TokenField}. */
function Token({ ref, className, ...props }: TokenProps) {
    return (
        <RACToken
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.token, className))}
        />
    );
}
Token.displayName = 'Token';

/**
 * Matches `#hashtags` and `@mentions`.
 *
 * The trailing `(?=\s)` is load-bearing: `tokenize` runs on every keystroke, so without
 * a closing boundary `@sarah` would tokenize as `[@s]` the moment the second character
 * is typed, and the rest of the word would land outside the (atomic, uneditable) token.
 * Requiring a following whitespace character means a token forms only once the word is
 * finished.
 */
const DEFAULT_TOKEN_PATTERN = /(?<=^|\s)[#@]\S+(?=\s)/g;

export interface TokenizingFieldValueOptions extends TokenFieldValueOptions {
    /** A regular expression matching the substrings to turn into tokens. */
    pattern?: RegExp;
}

/**
 * A {@link TokenFieldValue} that automatically converts matches of `pattern` into
 * tokens as the user types. Use it for hashtag/mention fields where tokenisation is
 * driven by the text itself rather than by picking from a list.
 *
 * Give `pattern` a closing boundary such as `(?=\s)` — see {@link DEFAULT_TOKEN_PATTERN}.
 *
 * @version alpha
 */
export class TokenizingFieldValue<T = unknown> extends TokenFieldValue<T> {
    readonly pattern: RegExp;

    constructor(
        tokens: readonly TokenFieldSegment<T>[],
        options?: TokenizingFieldValueOptions,
    ) {
        super(tokens, options);
        const pattern = options?.pattern ?? DEFAULT_TOKEN_PATTERN;
        // `matchAll` throws on a non-global regex, and a caller writing `/[#@]\S+(?=\s)/`
        // without the flag is a likely mistake rather than an intent to match once.
        this.pattern = pattern.global ? pattern : new RegExp(pattern.source, `${pattern.flags}g`);
    }

    /** Tokenises `text` against `pattern`, returning a ready-to-use field value. */
    static tokenize<T = unknown>(text: string, pattern?: RegExp): TokenizingFieldValue<T> {
        const value = new TokenizingFieldValue<T>([], { pattern });
        return value.createFieldValue(value.tokenize(text));
    }

    // The base class recreates values via `new this.constructor(segments)`, which would
    // drop the pattern — carry it across every derived value.
    createFieldValue(segments: readonly TokenFieldSegment<T>[]): this {
        const Constructor = this.constructor as new (
            segments: readonly TokenFieldSegment<T>[],
            options?: TokenizingFieldValueOptions,
        ) => this;
        return new Constructor(segments, { pattern: this.pattern });
    }

    tokenize(text: string): TokenFieldSegment<T>[] {
        if (text.length === 0) {
            return [{ type: 'text', text }];
        }

        const segments: TokenFieldSegment<T>[] = [];
        let last = 0;
        for (const match of text.matchAll(this.pattern)) {
            if (match.index > last) {
                segments.push({ type: 'text', text: text.slice(last, match.index) });
            }
            segments.push({ type: 'token', text: match[0] });
            last = match.index + match[0].length;
        }
        if (last < text.length) {
            segments.push({ type: 'text', text: text.slice(last) });
        }
        return segments;
    }
}

export { Token, TokenField, TokenFieldValue };
