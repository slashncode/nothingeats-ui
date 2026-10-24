'use client';

import type {
    InputProps as RACInputProps,
    TextAreaProps as RACTextAreaProps,
    TextFieldProps as RACTextFieldProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    Input as RACInput,
    TextArea as RACTextArea,
    TextField as RACTextField,
} from 'react-aria-components';

import { Description, FieldError, FieldGroup, Label } from '../Field/Field';
import styles from './TextField.module.scss';

export interface InputProps extends RACInputProps {
    ref?: React.RefObject<HTMLInputElement | null>;
}

function Input({ ref, className, ...props }: InputProps) {
    return (
        <RACInput
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.base, styles.input, className))}
        />
    );
}
Input.displayName = 'Input';

export interface TextAreaProps extends RACTextAreaProps {
    ref?: React.RefObject<HTMLTextAreaElement | null>;
}

function TextArea({ ref, className, ...props }: TextAreaProps) {
    return (
        <RACTextArea
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.base, styles.textarea, className))}
        />
    );
}
TextArea.displayName = 'TextArea';

export type TextFieldSlots = 'label' | 'input' | 'fieldGroup' | 'prefix' | 'suffix' | 'description' | 'errorMessage';

export interface TextFieldProps extends RACTextFieldProps {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    textArea?: boolean;
    placeholder?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    classNames?: Partial<Record<TextFieldSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function TextField({
    ref,
    label,
    description,
    errorMessage,
    textArea,
    className,
    classNames,
    placeholder,
    prefix,
    suffix,
    ...props
}: TextFieldProps) {
    const showPrefix = prefix != null && prefix !== '';
    const showSuffix = suffix != null && suffix !== '';
    const hasAffix = showPrefix || showSuffix;

    return (
        <RACTextField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.field, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            {textArea
                ? <TextArea placeholder={placeholder} className={classNames?.input} />
                : hasAffix
                    ? (
                            <FieldGroup className={clsx(styles.affixGroup, classNames?.fieldGroup)}>
                                {showPrefix && (
                                    <span className={clsx(styles.affix, classNames?.prefix)}>{prefix}</span>
                                )}
                                <RACInput
                                    placeholder={placeholder}
                                    className={clsx(styles.affixInput, classNames?.input)}
                                />
                                {showSuffix && (
                                    <span className={clsx(styles.affix, classNames?.suffix)}>{suffix}</span>
                                )}
                            </FieldGroup>
                        )
                    : <Input placeholder={placeholder} className={classNames?.input} />}
            {description && (
                <Description className={classNames?.description}>
                    {description}
                </Description>
            )}
            <FieldError className={classNames?.errorMessage}>
                {errorMessage}
            </FieldError>
        </RACTextField>
    );
}
TextField.displayName = 'TextField';

export { Input, TextArea, TextField };
