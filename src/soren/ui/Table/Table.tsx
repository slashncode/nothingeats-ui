'use client';

import type {
    CellProps as RACCellProps,
    ColumnProps as RACColumnProps,
    RowProps as RACRowProps,
    TableBodyProps as RACTableBodyProps,
    TableFooterProps as RACTableFooterProps,
    TableHeaderProps as RACTableHeaderProps,
    TableProps as RACTableProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import {
    Collection,
    composeRenderProps,
    Group,
    Cell as RACCell,
    Column as RACColumn,
    ColumnResizer as RACColumnResizer,
    Row as RACRow,
    Table as RACTable,
    TableBody as RACTableBody,
    TableFooter as RACTableFooter,
    TableHeader as RACTableHeader,
    ResizableTableContainer,
    useTableOptions,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './Table.module.scss';

export type TableSlots = 'container' | 'table';

export interface TableProps extends RACTableProps {
    classNames?: Partial<Record<TableSlots, string>>;
}

function Table({ children, className, classNames, ...props }: TableProps) {
    return (
        <ResizableTableContainer
            className={clsx(styles.resizableContainer, classNames?.container)}
        >
            <RACTable
                {...props}
                className={composeRenderProps(className, className =>
                    clsx(styles.table, classNames?.table, className))}
            >
                {children}
            </RACTable>
        </ResizableTableContainer>
    );
}
Table.displayName = 'Table';

export type ColumnSlots = 'column' | 'inner' | 'sortGroup' | 'content' | 'sortIndicator' | 'resizer';

export interface ColumnProps extends Omit<RACColumnProps, 'children'> {
    children?: React.ReactNode;
    isResizable?: boolean;
    classNames?: Partial<Record<ColumnSlots, string>>;
}

function Column({ classNames, ...props }: ColumnProps) {
    return (
        <RACColumn
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.header, classNames?.column, className))}
        >
            {composeRenderProps(props.children, (children, { allowsSorting, sortDirection }) => (
                <div className={clsx(styles.columnInner, classNames?.inner)}>
                    <Group
                        role="presentation"
                        tabIndex={-1}
                        className={clsx(styles.sortGroup, classNames?.sortGroup)}
                    >
                        <span className={clsx(styles.headerContent, classNames?.content)}>
                            {children}
                        </span>
                        {allowsSorting && (
                            <span
                                aria-hidden="true"
                                className={clsx(styles.sortIndicator, classNames?.sortIndicator)}
                            >
                                {sortDirection === 'ascending'
                                    ? <ArrowUp size={14} />
                                    : <ArrowDown size={14} />}
                            </span>
                        )}
                    </Group>

                    {props.isResizable && (
                        <RACColumnResizer
                            className={clsx(styles.resizer, classNames?.resizer)}
                        />
                    )}
                </div>
            ))}
        </RACColumn>
    );
}
Column.displayName = 'Column';

function TableHeader<T extends object>({
    columns,
    children,
    className,
    ...props
}: RACTableHeaderProps<T>) {
    const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

    return (
        <RACTableHeader {...props} className={className}>
            {allowsDragging && <Column />}
            {selectionBehavior === 'toggle' && (
                <Column>
                    {selectionMode === 'multiple' && <Checkbox slot="selection" />}
                </Column>
            )}
            <Collection items={columns}>
                {children}
            </Collection>
        </RACTableHeader>
    );
}
TableHeader.displayName = 'TableHeader';

function Row<T extends object>({
    id,
    columns,
    children,
    className,
    ...props
}: RACRowProps<T>) {
    const { selectionBehavior, allowsDragging } = useTableOptions();

    return (
        <RACRow
            id={id}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.row, className))}
        >
            {allowsDragging && (
                <Cell>
                    <Button
                        slot="drag"
                        variant="ghost"
                        size="icon"
                        aria-label="Drag to reorder"
                    >
                        <GripVertical size={18} />
                    </Button>
                </Cell>
            )}
            {selectionBehavior === 'toggle' && (
                <Cell>
                    <Checkbox slot="selection" />
                </Cell>
            )}
            <Collection items={columns}>
                {children}
            </Collection>
        </RACRow>
    );
}
Row.displayName = 'Row';

function Cell({ children, className, ...props }: RACCellProps) {
    return (
        <RACCell
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.cell, className))}
        >
            {children}
        </RACCell>
    );
}
Cell.displayName = 'Cell';

function TableBody<T extends object>(props: RACTableBodyProps<T>) {
    return <RACTableBody {...props} />;
}
TableBody.displayName = 'TableBody';

function TableFooter<T extends object>({ className, ...props }: RACTableFooterProps<T>) {
    return <RACTableFooter {...props} className={clsx(styles.footer, className)} />;
}
TableFooter.displayName = 'TableFooter';

export { Cell, Column, Row, Table, TableBody, TableFooter, TableHeader };
