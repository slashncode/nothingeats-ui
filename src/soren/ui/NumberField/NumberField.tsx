'use client';

import type {
    NumberFieldProps as RACNumberFieldProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    composeRenderProps,
    Input as RACInput,
    NumberField as RACNumberField,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { Description, FieldError, FieldGroup, Label } from '../Field/Field';
import styles from './NumberField.module.scss';

export type NumberFieldSlots
    = | 'label'
        | 'fieldGroup'
        | 'input'
        | 'prefix'
        | 'suffix'
        | 'steppers'
        | 'incrementButton'
        | 'decrementButton'
        | 'description'
        | 'errorMessage';

export interface NumberFieldProps extends RACNumberFieldProps {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    showSteppers?: boolean;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    classNames?: Partial<Record<NumberFieldSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function NumberField({
    ref,
    label,
    description,
    errorMessage,
    className,
    classNames,
    showSteppers = true,
    prefix,
    suffix,
    ...props
}: NumberFieldProps) {
    return (
        <RACNumberField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.field, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}

            <FieldGroup className={clsx(styles.group, classNames?.fieldGroup)}>
                {prefix != null && prefix !== '' && (
                    <span className={clsx(styles.affix, classNames?.prefix)}>{prefix}</span>
                )}
                <RACInput className={clsx(styles.input, classNames?.input)} />
                {suffix != null && suffix !== '' && (
                    <span className={clsx(styles.affix, classNames?.suffix)}>{suffix}</span>
                )}
                {showSteppers && (
                    <div className={clsx(styles.steppers, classNames?.steppers)}>
                        <Button
                            slot="increment"
                            aria-label="Increment"
                            className={clsx(styles.stepper, classNames?.incrementButton)}
                        >
                            <ChevronUp size={12} aria-hidden />
                        </Button>
                        <Button
                            slot="decrement"
                            aria-label="Decrement"
                            className={clsx(styles.stepper, classNames?.decrementButton)}
                        >
                            <ChevronDown size={12} aria-hidden />
                        </Button>
                    </div>
                )}
            </FieldGroup>

            {description && (
                <Description className={classNames?.description}>{description}</Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
        </RACNumberField>
    );
}
NumberField.displayName = 'NumberField';

export { NumberField };
