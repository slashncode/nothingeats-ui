'use client';

import type {
    CheckboxButtonProps as RACCheckboxButtonProps,
    CheckboxFieldProps as RACCheckboxFieldProps,
    CheckboxGroupProps as RACCheckboxGroupProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import { Check, Minus } from 'lucide-react';
import {
    composeRenderProps,
    FieldError,
    Label,
    CheckboxButton as RACCheckboxButton,
    CheckboxField as RACCheckboxField,
    CheckboxGroup as RACCheckboxGroup,
    Text,
} from 'react-aria-components';

import styles from './Checkbox.module.scss';

export type CheckboxButtonSlots = 'indicator' | 'label';

export interface CheckboxButtonProps extends RACCheckboxButtonProps {
    classNames?: Partial<Record<CheckboxButtonSlots, string>>;
    ref?: React.RefObject<HTMLLabelElement | null>;
}

// The clickable area of a checkbox — renders the indicator + label, reading
// selection state from the surrounding CheckboxField.
function CheckboxButton({ ref, className, classNames, children, ...props }: CheckboxButtonProps) {
    return (
        <RACCheckboxButton
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.checkbox, className))}
        >
            {composeRenderProps(children, (children, { isIndeterminate, isSelected }) => (
                <>
                    <div className={clsx(styles.indicator, classNames?.indicator)}>
                        {isIndeterminate
                            ? <Minus aria-hidden size={14} strokeWidth={3} />
                            : isSelected
                                ? <Check aria-hidden size={14} strokeWidth={3} />
                                : null}
                    </div>
                    {children && (
                        <span className={clsx(classNames?.label)}>{children}</span>
                    )}
                </>
            ))}
        </RACCheckboxButton>
    );
}
CheckboxButton.displayName = 'CheckboxButton';

export interface CheckboxFieldProps extends RACCheckboxFieldProps {
    ref?: React.RefObject<HTMLDivElement | null>;
}

// The stateful container for a single checkbox — owns selection/validation
// props and provides the description/error slots.
function CheckboxField({ ref, className, ...props }: CheckboxFieldProps) {
    return (
        <RACCheckboxField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.field, className))}
        />
    );
}
CheckboxField.displayName = 'CheckboxField';

export type CheckboxSlots = 'field' | 'indicator' | 'label' | 'description' | 'errorMessage';

export interface CheckboxProps extends RACCheckboxFieldProps {
    children?: React.ReactNode;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    classNames?: Partial<Record<CheckboxSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

// Convenience checkbox: composes CheckboxField + CheckboxButton plus optional
// description / error message. Keeps the original `<Checkbox>Label</Checkbox>` API.
function Checkbox({ ref, className, classNames, children, description, errorMessage, ...props }: CheckboxProps) {
    return (
        <CheckboxField
            ref={ref}
            {...props}
            className={clsx(classNames?.field, className)}
        >
            <CheckboxButton classNames={{ indicator: classNames?.indicator, label: classNames?.label }}>
                {children}
            </CheckboxButton>
            {description && (
                <Text
                    slot="description"
                    className={clsx(styles.description, classNames?.description)}
                >
                    {description}
                </Text>
            )}
            <FieldError className={clsx(styles.error, classNames?.errorMessage)}>
                {errorMessage}
            </FieldError>
        </CheckboxField>
    );
}
Checkbox.displayName = 'Checkbox';

export type CheckboxGroupSlots = 'group' | 'label' | 'description' | 'errorMessage';

export interface CheckboxGroupProps extends RACCheckboxGroupProps {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    orientation?: 'horizontal' | 'vertical';
    classNames?: Partial<Record<CheckboxGroupSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function CheckboxGroup({
    ref,
    className,
    classNames,
    label,
    description,
    errorMessage,
    children,
    orientation = 'vertical',
    ...props
}: CheckboxGroupProps) {
    return (
        <RACCheckboxGroup
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.group, classNames?.group, className))}
            data-orientation={orientation}
        >
            {composeRenderProps(children, children => (
                <>
                    {label && (
                        <Label className={clsx(styles.label, classNames?.label)}>
                            {label}
                        </Label>
                    )}
                    {children}
                    {description && (
                        <Text
                            slot="description"
                            className={clsx(styles.description, classNames?.description)}
                        >
                            {description}
                        </Text>
                    )}
                    <FieldError className={clsx(styles.error, classNames?.errorMessage)}>
                        {errorMessage}
                    </FieldError>
                </>
            ))}
        </RACCheckboxGroup>
    );
}
CheckboxGroup.displayName = 'CheckboxGroup';

export { Checkbox, CheckboxButton, CheckboxField, CheckboxGroup };
