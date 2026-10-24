'use client';

import type {
    DateValue,
    CalendarCellProps as RACCalendarCellProps,
    RangeCalendarProps as RACRangeCalendarProps,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    CalendarCell as RACCalendarCell,
    CalendarGrid as RACCalendarGrid,
    CalendarGridBody as RACCalendarGridBody,
    CalendarGridHeader as RACCalendarGridHeader,
    CalendarHeaderCell as RACCalendarHeaderCell,
    RangeCalendar as RACRangeCalendar,
    Text as RACText,
} from 'react-aria-components';

import { CalendarHeader } from '../Calendar/Calendar';
import styles from './RangeCalendar.module.scss';

export type RangeCalendarSlots
    = | 'header'
        | 'previousButton'
        | 'nextButton'
        | 'heading'
        | 'pickers'
        | 'monthPicker'
        | 'yearPicker'
        | 'grid'
        | 'gridHeader'
        | 'headerCell'
        | 'gridBody'
        | 'cell'
        | 'errorMessage';

function CalendarCell(props: RACCalendarCellProps) {
    return (
        <RACCalendarCell
            {...props}
            className={composeRenderProps('', (_, renderProps) =>
                clsx(styles.cell, {
                    [styles.selected]: renderProps.isSelected,
                    [styles.outside]: renderProps.isOutsideMonth,
                    [styles.disabled]: renderProps.isDisabled,
                    [styles.unavailable]: renderProps.isUnavailable,
                    [styles.rangeStart]: renderProps.isSelectionStart,
                    [styles.rangeEnd]: renderProps.isSelectionEnd,
                    [styles.rangeMiddle]:
                        renderProps.isSelected
                        && !renderProps.isSelectionStart
                        && !renderProps.isSelectionEnd,
                }))}
        />
    );
}
CalendarCell.displayName = 'CalendarCell';

export interface RangeCalendarProps<T extends DateValue> extends RACRangeCalendarProps<T> {
    errorMessage?: string;
    previousAriaLabel?: string;
    nextAriaLabel?: string;
    monthYearPickers?: boolean;
    classNames?: Partial<Record<RangeCalendarSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function RangeCalendar<T extends DateValue>({
    ref,
    errorMessage,
    className,
    classNames,
    previousAriaLabel,
    nextAriaLabel,
    monthYearPickers,
    ...props
}: RangeCalendarProps<T>) {
    return (
        <RACRangeCalendar
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.calendar, className))}
        >
            <CalendarHeader
                previousAriaLabel={previousAriaLabel}
                nextAriaLabel={nextAriaLabel}
                monthYearPickers={monthYearPickers}
                classNames={classNames}
            />
            <RACCalendarGrid className={clsx(styles.grid, classNames?.grid)}>
                <RACCalendarGridHeader className={clsx(styles.gridHeader, classNames?.gridHeader)}>
                    {day => (
                        <RACCalendarHeaderCell className={clsx(styles.headerCell, classNames?.headerCell)}>
                            {day}
                        </RACCalendarHeaderCell>
                    )}
                </RACCalendarGridHeader>
                <RACCalendarGridBody className={classNames?.gridBody}>
                    {date => <CalendarCell date={date} />}
                </RACCalendarGridBody>
            </RACCalendarGrid>
            {errorMessage && (
                <RACText
                    slot="errorMessage"
                    className={clsx(styles.errorMessage, classNames?.errorMessage)}
                >
                    {errorMessage}
                </RACText>
            )}
        </RACRangeCalendar>
    );
}
RangeCalendar.displayName = 'RangeCalendar';

export { RangeCalendar };
