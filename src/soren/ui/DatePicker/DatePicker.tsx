'use client';

import type {
    DateValue,
    DatePickerProps as RACDatePickerProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import { CalendarIcon } from 'lucide-react';
import { composeRenderProps, DatePicker as RACDatePicker } from 'react-aria-components';

import { Button } from '../Button/Button';
import { Calendar } from '../Calendar/Calendar';
import { DateInput } from '../DateField/DateField';
import { Description, FieldError, FieldGroup, Label } from '../Field/Field';
import { Popover, PopoverDialog } from '../Popover/Popover';
import styles from './DatePicker.module.scss';

export type DatePickerSlots
    = | 'label'
        | 'fieldGroup'
        | 'input'
        | 'button'
        | 'popover'
        | 'dialog'
        | 'calendar'
        | 'description'
        | 'errorMessage';

export interface DatePickerProps<T extends DateValue> extends RACDatePickerProps<T> {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    monthYearPickers?: boolean;
    classNames?: Partial<Record<DatePickerSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function DatePicker<T extends DateValue>({
    ref,
    label,
    description,
    errorMessage,
    monthYearPickers,
    className,
    classNames,
    ...props
}: DatePickerProps<T>) {
    return (
        <RACDatePicker
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.group, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <FieldGroup className={clsx(styles.inputGroup, classNames?.fieldGroup)}>
                <DateInput className={clsx(styles.dateInput, classNames?.input)} />
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open calendar"
                    className={clsx(styles.iconButton, classNames?.button)}
                >
                    <CalendarIcon aria-hidden className={styles.calendarIcon} />
                </Button>
            </FieldGroup>
            {description && (
                <Description className={clsx(styles.description, classNames?.description)}>
                    {description}
                </Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
            <Popover className={clsx(styles.popover, classNames?.popover)}>
                <PopoverDialog className={clsx(styles.dialog, classNames?.dialog)}>
                    <Calendar monthYearPickers={monthYearPickers} className={classNames?.calendar} />
                </PopoverDialog>
            </Popover>
        </RACDatePicker>
    );
}
DatePicker.displayName = 'DatePicker';

export { DatePicker };
