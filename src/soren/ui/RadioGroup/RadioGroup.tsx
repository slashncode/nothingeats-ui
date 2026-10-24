'use client';

import type {
    RadioButtonProps as RACRadioButtonProps,
    RadioFieldProps as RACRadioFieldProps,
    RadioGroupProps as RACRadioGroupProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    RadioButton as RACRadioButton,
    RadioField as RACRadioField,
    RadioGroup as RACRadioGroup,
    Text,
} from 'react-aria-components';

import { Description, FieldError, Label } from '../Field/Field';
import styles from './RadioGroup.module.scss';

export type RadioGroupSlots = 'group' | 'wrapper' | 'label' | 'description' | 'errorMessage';

export interface RadioGroupProps extends Omit<RACRadioGroupProps, 'children'> {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    children?: React.ReactNode;
    classNames?: Partial<Record<RadioGroupSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function RadioGroup({
    ref,
    label,
    description,
    errorMessage,
    className,
    classNames,
    children,
    orientation = 'vertical',
    ...props
}: RadioGroupProps) {
    return (
        <RACRadioGroup
            ref={ref}
            {...props}
            orientation={orientation}
            className={composeRenderProps(className, className =>
                clsx(styles.group, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <div
                className={clsx(styles.wrapper, classNames?.wrapper)}
                data-orientation={orientation}
            >
                {children}
            </div>
            {description && (
                <Description className={classNames?.description}>{description}</Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
        </RACRadioGroup>
    );
}
RadioGroup.displayName = 'RadioGroup';

export type RadioButtonSlots = 'radio' | 'indicator';

export interface RadioButtonProps extends RACRadioButtonProps {
    classNames?: Partial<Record<RadioButtonSlots, string>>;
    ref?: React.RefObject<HTMLLabelElement | null>;
}

// The clickable area of a radio — renders the indicator + label.
function RadioButton({ ref, className, classNames, children, ...props }: RadioButtonProps) {
    return (
        <RACRadioButton
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.radio, classNames?.radio, className))}
        >
            {composeRenderProps(children, children => (
                <>
                    <span className={clsx(styles.indicator, classNames?.indicator)} />
                    {children}
                </>
            ))}
        </RACRadioButton>
    );
}
RadioButton.displayName = 'RadioButton';

export interface RadioFieldProps extends RACRadioFieldProps {
    ref?: React.RefObject<HTMLDivElement | null>;
}

// The container for a single radio option — owns the option `value` and
// provides the description slot.
function RadioField({ ref, className, ...props }: RadioFieldProps) {
    return (
        <RACRadioField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.field, className))}
        />
    );
}
RadioField.displayName = 'RadioField';

export type RadioSlots = 'field' | 'radio' | 'indicator' | 'description';

export interface RadioProps extends RACRadioFieldProps {
    children?: React.ReactNode;
    description?: string;
    classNames?: Partial<Record<RadioSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

// Convenience radio: composes RadioField + RadioButton plus optional
// description. Keeps the original `<Radio value="x">Label</Radio>` API.
function Radio({ ref, className, classNames, children, description, ...props }: RadioProps) {
    return (
        <RadioField
            ref={ref}
            {...props}
            className={clsx(classNames?.field, className)}
        >
            <RadioButton classNames={{ radio: classNames?.radio, indicator: classNames?.indicator }}>
                {children}
            </RadioButton>
            {description && (
                <Text
                    slot="description"
                    className={clsx(styles.description, classNames?.description)}
                >
                    {description}
                </Text>
            )}
        </RadioField>
    );
}
Radio.displayName = 'Radio';

export { Radio, RadioButton, RadioField, RadioGroup };
