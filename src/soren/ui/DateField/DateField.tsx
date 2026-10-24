'use client';

import type {
    DateValue,
    DateFieldProps as RACDateFieldProps,
    DateInputProps as RACDateInputProps,
    DateSegmentProps as RACDateSegmentProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    DateField as RACDateField,
    DateInput as RACDateInput,
    DateSegment as RACDateSegment,
} from 'react-aria-components';

import { Description, FieldError, Label } from '../Field/Field';
import styles from './DateField.module.scss';

function DateSegment({ className, ...props }: RACDateSegmentProps) {
    return (
        <RACDateSegment
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.segment, className))}
        />
    );
}
DateSegment.displayName = 'DateSegment';

function DateInput({ className, ...props }: Omit<RACDateInputProps, 'children'>) {
    return (
        <RACDateInput
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.input, className))}
        >
            {segment => <DateSegment segment={segment} />}
        </RACDateInput>
    );
}
DateInput.displayName = 'DateInput';

export type DateFieldSlots
    = | 'label'
        | 'input'
        | 'segment'
        | 'description'
        | 'errorMessage';

export interface DateFieldProps<T extends DateValue> extends RACDateFieldProps<T> {
    ref?: React.RefObject<HTMLDivElement | null>;
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    classNames?: Partial<Record<DateFieldSlots, string>>;
}

function DateField<T extends DateValue>({
    ref,
    label,
    description,
    errorMessage,
    className,
    classNames,
    ...props
}: DateFieldProps<T>) {
    return (
        <RACDateField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.field, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <DateInput className={classNames?.input} />
            {description && (
                <Description className={classNames?.description}>{description}</Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
        </RACDateField>
    );
}
DateField.displayName = 'DateField';

export { DateField, DateInput, DateSegment };
