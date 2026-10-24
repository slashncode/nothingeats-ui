'use client';

import type {
    DateValue,
    CalendarCellProps as RACCalendarCellProps,
    CalendarGridProps as RACCalendarGridProps,
    CalendarProps as RACCalendarProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    composeRenderProps,
    Calendar as RACCalendar,
    CalendarCell as RACCalendarCell,
    CalendarGrid as RACCalendarGrid,
    CalendarGridBody as RACCalendarGridBody,
    CalendarGridHeader as RACCalendarGridHeader,
    CalendarHeaderCell as RACCalendarHeaderCell,
    CalendarMonthPicker as RACCalendarMonthPicker,
    CalendarYearPicker as RACCalendarYearPicker,
    Heading as RACHeading,
    Text as RACText,
    useLocale,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import styles from './Calendar.module.scss';

// Mirrors react-aria-components' CalendarSelectionMode (not re-exported from
// the package entry). 'range' is handled separately by RangeCalendar.
type CalendarSelectionMode = 'single' | 'multiple';

export type CalendarSlots
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

export type CalendarPickerSlots = Partial<Pick<Record<CalendarSlots, string>, 'pickers' | 'monthPicker' | 'yearPicker'>>;

// Month + year dropdowns that let the user jump to a different month/year.
// Built on RAC's CalendarMonthPicker / CalendarYearPicker render-prop APIs.
function MonthYearPickers({ classNames }: { classNames?: CalendarPickerSlots }) {
    // RangeCalendar attaches a window pointerup handler that commits/cancels an
    // in-progress range selection when the press target isn't a button. The
    // native <select>s aren't buttons, so stop pointer events from bubbling to
    // the window — otherwise picking a year mid-selection drops the start date.
    const stopPointer = (e: React.PointerEvent) => e.stopPropagation();
    return (
        <div
            className={clsx(styles.pickers, classNames?.pickers)}
            onPointerDown={stopPointer}
            onPointerUp={stopPointer}
        >
            <RACCalendarMonthPicker>
                {({ 'aria-label': ariaLabel, value, onChange, items }) => (
                    <select
                        aria-label={ariaLabel}
                        value={String(value)}
                        onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
                        className={clsx(styles.pickerSelect, classNames?.monthPicker)}
                    >
                        {items.map(item => (
                            <option key={item.id} value={item.id}>{item.formatted}</option>
                        ))}
                    </select>
                )}
            </RACCalendarMonthPicker>
            <RACCalendarYearPicker>
                {({ 'aria-label': ariaLabel, value, onChange, items }) => (
                    <select
                        aria-label={ariaLabel}
                        value={String(value)}
                        onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
                        className={clsx(styles.pickerSelect, classNames?.yearPicker)}
                    >
                        {items.map(item => (
                            <option key={item.id} value={item.id}>{item.formatted}</option>
                        ))}
                    </select>
                )}
            </RACCalendarYearPicker>
        </div>
    );
}
MonthYearPickers.displayName = 'MonthYearPickers';

export interface CalendarHeaderProps {
    previousAriaLabel?: string;
    nextAriaLabel?: string;
    monthYearPickers?: boolean;
    classNames?: Partial<Pick<Record<CalendarSlots, string>, 'header' | 'previousButton' | 'nextButton' | 'heading' | 'pickers' | 'monthPicker' | 'yearPicker'>>;
}

function CalendarHeader({
    previousAriaLabel = 'Previous month',
    nextAriaLabel = 'Next month',
    monthYearPickers = false,
    classNames,
}: CalendarHeaderProps) {
    const { direction } = useLocale();
    return (
        <header className={clsx(styles.header, classNames?.header)}>
            <Button
                slot="previous"
                variant="ghost"
                size="icon"
                aria-label={previousAriaLabel}
                className={classNames?.previousButton}
            >
                {direction === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
            {monthYearPickers
                ? <MonthYearPickers classNames={classNames} />
                : <RACHeading className={clsx(styles.heading, classNames?.heading)} />}
            <Button
                slot="next"
                variant="ghost"
                size="icon"
                aria-label={nextAriaLabel}
                className={classNames?.nextButton}
            >
                {direction === 'rtl' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </Button>
        </header>
    );
}
CalendarHeader.displayName = 'CalendarHeader';

interface CalendarGridProps extends RACCalendarGridProps {
    cellClassName?: string;
    classNames?: Partial<Pick<Record<CalendarSlots, string>, 'grid' | 'gridHeader' | 'headerCell' | 'gridBody' | 'cell'>>;
}

function CalendarGrid({ classNames, cellClassName, ...props }: CalendarGridProps) {
    return (
        <RACCalendarGrid {...props} className={clsx(styles.grid, classNames?.grid)}>
            <RACCalendarGridHeader className={clsx(styles.gridHeader, classNames?.gridHeader)}>
                {day => (
                    <RACCalendarHeaderCell className={clsx(styles.headerCell, classNames?.headerCell)}>
                        {day}
                    </RACCalendarHeaderCell>
                )}
            </RACCalendarGridHeader>
            <RACCalendarGridBody className={classNames?.gridBody}>
                {date => <CalendarCell date={date} className={clsx(classNames?.cell, cellClassName)} />}
            </RACCalendarGridBody>
        </RACCalendarGrid>
    );
}
CalendarGrid.displayName = 'CalendarGrid';

function CalendarCell({ className, ...props }: RACCalendarCellProps & { className?: string }) {
    return (
        <RACCalendarCell
            {...props}
            className={composeRenderProps('', (_, renderProps) =>
                clsx(
                    styles.cell,
                    {
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
                    },
                    className,
                ))}
        />
    );
}
CalendarCell.displayName = 'CalendarCell';

export interface CalendarProps<T extends DateValue, M extends CalendarSelectionMode = 'single'> extends RACCalendarProps<T, M> {
    errorMessage?: string;
    previousAriaLabel?: string;
    nextAriaLabel?: string;
    monthYearPickers?: boolean;
    classNames?: Partial<Record<CalendarSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Calendar<T extends DateValue, M extends CalendarSelectionMode = 'single'>({
    ref,
    errorMessage,
    className,
    classNames,
    previousAriaLabel,
    nextAriaLabel,
    monthYearPickers,
    ...props
}: CalendarProps<T, M>) {
    return (
        <RACCalendar
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
            <CalendarGrid classNames={classNames} />
            {errorMessage && (
                <RACText
                    slot="errorMessage"
                    className={clsx(styles.errorMessage, classNames?.errorMessage)}
                >
                    {errorMessage}
                </RACText>
            )}
        </RACCalendar>
    );
}
Calendar.displayName = 'Calendar';

export { Calendar, CalendarCell, CalendarGrid, CalendarHeader };
