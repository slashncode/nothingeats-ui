'use client';

import type {
    ColorFieldProps as RACColorFieldProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    ColorField as RACColorField,
    Input as RACInput,
} from 'react-aria-components';

import { Description, FieldError, FieldGroup, Label } from '../Field/Field';
import styles from './ColorField.module.scss';

export type ColorFieldSlots = 'label' | 'input' | 'fieldGroup' | 'prefix' | 'suffix' | 'description' | 'errorMessage';

export interface ColorFieldProps extends RACColorFieldProps {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    classNames?: Partial<Record<ColorFieldSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ColorField({
    ref,
    label,
    description,
    errorMessage,
    className,
    classNames,
    prefix,
    suffix,
    ...props
}: ColorFieldProps) {
    const showPrefix = prefix != null && prefix !== '';
    const showSuffix = suffix != null && suffix !== '';
    const hasAffix = showPrefix || showSuffix;

    return (
        <RACColorField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.colorField, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            {hasAffix
                ? (
                        <FieldGroup className={clsx(styles.affixGroup, classNames?.fieldGroup)}>
                            {showPrefix && (
                                <span className={clsx(styles.affix, classNames?.prefix)}>{prefix}</span>
                            )}
                            <RACInput className={clsx(styles.affixInput, classNames?.input)} />
                            {showSuffix && (
                                <span className={clsx(styles.affix, classNames?.suffix)}>{suffix}</span>
                            )}
                        </FieldGroup>
                    )
                : <RACInput className={clsx(styles.input, classNames?.input)} />}
            {description && (
                <Description className={classNames?.description}>{description}</Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
        </RACColorField>
    );
}
ColorField.displayName = 'ColorField';

export { ColorField };
