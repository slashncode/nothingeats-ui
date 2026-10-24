'use client';

import type {
    DateValue,
    DateRangePickerProps as RACDateRangeProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import { CalendarIcon } from 'lucide-react';
import { composeRenderProps, DateRangePicker as RACDateRangePicker } from 'react-aria-components';

import { Button } from '../Button/Button';
import { DateInput } from '../DateField/DateField';
import { Description, FieldError, FieldGroup, Label } from '../Field/Field';
import { Popover, PopoverDialog } from '../Popover/Popover';
import { RangeCalendar } from '../RangeCalendar/RangeCalendar';
import styles from './DateRangePicker.module.scss';

export type DateRangePickerSlots
    = | 'label'
        | 'fieldGroup'
        | 'startInput'
        | 'endInput'
        | 'separator'
        | 'button'
        | 'popover'
        | 'dialog'
        | 'description'
        | 'errorMessage';

export interface DateRangePickerProps<T extends DateValue> extends RACDateRangeProps<T> {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    startAriaLabel?: string;
    endAriaLabel?: string;
    monthYearPickers?: boolean;
    classNames?: Partial<Record<DateRangePickerSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function DateRangePicker<T extends DateValue>({
    ref,
    label,
    description,
    errorMessage,
    className,
    classNames,
    startAriaLabel,
    endAriaLabel,
    monthYearPickers,
    ...props
}: DateRangePickerProps<T>) {
    return (
        <RACDateRangePicker
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.group, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <FieldGroup className={clsx(styles.inputGroup, classNames?.fieldGroup)}>
                <DateInput
                    slot="start"
                    aria-label={startAriaLabel}
                    className={clsx(styles.dateInput, classNames?.startInput)}
                />
                <span aria-hidden className={clsx(styles.separator, classNames?.separator)}>-</span>
                <DateInput
                    slot="end"
                    aria-label={endAriaLabel}
                    className={clsx(styles.dateInput, classNames?.endInput)}
                />
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
                    <RangeCalendar monthYearPickers={monthYearPickers} />
                </PopoverDialog>
            </Popover>
        </RACDateRangePicker>
    );
}
DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
