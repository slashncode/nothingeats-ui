'use client';

import type {
    DateInputProps as RACDateInputProps,
    DateSegmentProps as RACDateSegmentProps,
    TimeFieldProps as RACTimeFieldProps,
    TimeValue,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    DateInput as RACDateInput,
    DateSegment as RACDateSegment,
    TimeField as RACTimeField,
} from 'react-aria-components';

import { Description, FieldError, Label } from '../Field/Field';
import styles from './TimeField.module.scss';

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

export type TimeFieldSlots
    = | 'label'
        | 'input'
        | 'segment'
        | 'description'
        | 'errorMessage';

export interface TimeFieldProps<T extends TimeValue> extends RACTimeFieldProps<T> {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    classNames?: Partial<Record<TimeFieldSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function TimeField<T extends TimeValue>({
    ref,
    label,
    description,
    errorMessage,
    className,
    classNames,
    ...props
}: TimeFieldProps<T>) {
    return (
        <RACTimeField
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
        </RACTimeField>
    );
}
TimeField.displayName = 'TimeField';

export { DateInput, DateSegment, TimeField };
