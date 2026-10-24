'use client';

import type {
    GridListItemProps as RACGridListItemProps,
    GridListLoadMoreItemProps as RACGridListLoadMoreItemProps,
    GridListProps as RACGridListProps,
    GridListSectionProps as RACGridListSectionProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { GripVertical, Loader2 } from 'lucide-react';
import {
    composeRenderProps,
    GridList as RACGridList,
    GridListHeader as RACGridListHeader,
    GridListItem as RACGridListItem,
    GridListLoadMoreItem as RACGridListLoadMoreItem,
    GridListSection as RACGridListSection,
    Text,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './GridList.module.scss';

export type GridListSlots = 'list';

export interface GridListProps<T extends object> extends RACGridListProps<T> {
    classNames?: Partial<Record<GridListSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function GridList<T extends object>({
    ref,
    children,
    className,
    classNames,
    ...props
}: GridListProps<T>) {
    return (
        <RACGridList
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.gridList, classNames?.list, className))}
        >
            {children}
        </RACGridList>
    );
}
GridList.displayName = 'GridList';

export type GridListItemSlots = 'item' | 'dragHandle' | 'check';

export interface GridListItemProps extends RACGridListItemProps {
    classNames?: Partial<Record<GridListItemSlots, string>>;
}

function GridListItem({ children, className, classNames, ...props }: GridListItemProps) {
    // Explicit `textValue` wins; fall back to plain-string children for typeahead.
    const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
    return (
        <RACGridListItem
            {...props}
            textValue={textValue}
            className={composeRenderProps(className, className =>
                clsx(styles.gridListItem, classNames?.item, className))}
        >
            {composeRenderProps(children, (children, { selectionMode, selectionBehavior, allowsDragging }) => (
                <>
                    {allowsDragging && (
                        <Button
                            slot="drag"
                            variant="ghost"
                            size="icon"
                            aria-label="Drag to reorder"
                            className={clsx(styles.dragButton, classNames?.dragHandle)}
                        >
                            <GripVertical size={18} aria-hidden />
                        </Button>
                    )}
                    {selectionMode === 'multiple' && selectionBehavior === 'toggle' && (
                        <Checkbox slot="selection" classNames={{ indicator: classNames?.check }} />
                    )}
                    {children}
                </>
            ))}
        </RACGridListItem>
    );
}
GridListItem.displayName = 'GridListItem';

export type GridListSectionSlots = 'section';

export interface GridListSectionProps<T extends object>
    extends RACGridListSectionProps<T> {
    classNames?: Partial<Record<GridListSectionSlots, string>>;
}

// Groups items under an optional <GridListHeader>. Sections without a header
// must have an `aria-label`.
function GridListSection<T extends object>({ className, classNames, ...props }: GridListSectionProps<T>) {
    return (
        <RACGridListSection
            {...props}
            className={clsx(styles.section, classNames?.section, className)}
        />
    );
}
GridListSection.displayName = 'GridListSection';

function GridListHeader({ className, ...props }: React.ComponentProps<typeof RACGridListHeader>) {
    return (
        <RACGridListHeader
            {...props}
            className={clsx(styles.sectionHeader, className)}
        />
    );
}
GridListHeader.displayName = 'GridListHeader';

export interface GridListLoadMoreItemProps extends RACGridListLoadMoreItemProps {
    /** Accessible label announced while loading. */
    loadingLabel?: string;
}

// Render at the end of the list to enable infinite scrolling. Pass
// `onLoadMore` + `isLoading` from your data-fetching library (e.g. useAsyncList).
function GridListLoadMoreItem({ children, loadingLabel = 'Loading more…', ...props }: GridListLoadMoreItemProps) {
    return (
        <RACGridListLoadMoreItem {...props} className={clsx(styles.loadMore, props.className)}>
            {children ?? (
                <Loader2 className={styles.spinner} size={18} aria-label={loadingLabel} />
            )}
        </RACGridListLoadMoreItem>
    );
}
GridListLoadMoreItem.displayName = 'GridListLoadMoreItem';

export {
    GridList,
    GridListHeader,
    GridListItem,
    GridListLoadMoreItem,
    GridListSection,
    Text as GridListText,
};
