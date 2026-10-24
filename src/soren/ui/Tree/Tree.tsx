'use client';

import type {
    TreeItemContentProps as RACTreeItemContentProps,
    TreeItemProps as RACTreeItemProps,
    TreeLoadMoreItemProps as RACTreeLoadMoreItemProps,
    TreeProps as RACTreeProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { ChevronRight, GripVertical, Loader2 } from 'lucide-react';
import {
    composeRenderProps,
    Tree as RACTree,
    TreeHeader as RACTreeHeader,
    TreeItem as RACTreeItem,
    TreeItemContent as RACTreeItemContent,
    TreeLoadMoreItem as RACTreeLoadMoreItem,
    TreeSection as RACTreeSection,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './Tree.module.scss';

export type TreeSlots = 'tree';

export interface TreeProps<T extends object> extends RACTreeProps<T> {
    classNames?: Partial<Record<TreeSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Tree<T extends object>({
    ref,
    children,
    className,
    classNames,
    ...props
}: TreeProps<T>) {
    return (
        <RACTree
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.tree, classNames?.tree, className))}
        >
            {children}
        </RACTree>
    );
}
Tree.displayName = 'Tree';

export type TreeItemSlots = 'item';

export interface TreeItemProps<T extends object> extends RACTreeItemProps<T> {
    classNames?: Partial<Record<TreeItemSlots, string>>;
}

function TreeItem<T extends object>({ classNames, ...props }: TreeItemProps<T>) {
    return (
        <RACTreeItem
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.treeItem, classNames?.item, className))}
        >
            {props.children}
        </RACTreeItem>
    );
}
TreeItem.displayName = 'TreeItem';

export type TreeItemContentSlots
    = | 'content'
        | 'chevron'
        | 'dragHandle'
        | 'selectionCheckbox'
        | 'label';

export interface TreeItemContentProps
    extends Omit<RACTreeItemContentProps, 'children'> {
    children?: React.ReactNode;
    className?: string;
    classNames?: Partial<Record<TreeItemContentSlots, string>>;
}

function TreeItemContent({ className, classNames, children, ...props }: TreeItemContentProps) {
    return (
        <RACTreeItemContent {...props}>
            {({ hasChildItems, selectionBehavior, selectionMode, allowsDragging }) => (
                <div className={clsx(styles.treeItemContent, classNames?.content, className)}>
                    {allowsDragging && (
                        <Button
                            slot="drag"
                            variant="ghost"
                            size="icon"
                            aria-label="Drag to reorder"
                            className={clsx(styles.dragButton, classNames?.dragHandle)}
                        >
                            <GripVertical size={16} aria-hidden />
                        </Button>
                    )}

                    <Button
                        slot="chevron"
                        variant="ghost"
                        size="icon"
                        className={clsx(styles.chevronBtn, classNames?.chevron)}
                        data-has-children={hasChildItems}
                    >
                        <ChevronRight className={styles.chevronIcon} aria-hidden />
                    </Button>

                    {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
                        <Checkbox
                            slot="selection"
                            classNames={{ indicator: classNames?.selectionCheckbox }}
                            className={styles.checkbox}
                        />
                    )}
                    <span className={clsx(styles.label, classNames?.label)}>{children}</span>
                </div>
            )}
        </RACTreeItemContent>
    );
}
TreeItemContent.displayName = 'TreeItemContent';

// Groups items under an optional <TreeHeader>. Sections without a header must
// have an `aria-label`.
function TreeSection<T extends object>(props: React.ComponentProps<typeof RACTreeSection<T>>) {
    return (
        <RACTreeSection
            {...props}
            className={clsx(styles.section, props.className)}
        />
    );
}
TreeSection.displayName = 'TreeSection';

function TreeHeader({ className, ...props }: React.ComponentProps<typeof RACTreeHeader>) {
    return (
        <RACTreeHeader {...props} className={clsx(styles.sectionHeader, className)} />
    );
}
TreeHeader.displayName = 'TreeHeader';

export interface TreeLoadMoreItemProps extends RACTreeLoadMoreItemProps {
    /** Accessible label announced while loading. */
    loadingLabel?: string;
}

// Render at the end of a <TreeItem>'s children to enable infinite scrolling.
// Pass `onLoadMore` + `isLoading` from your data-fetching library.
function TreeLoadMoreItem({ children, loadingLabel = 'Loading more…', ...props }: TreeLoadMoreItemProps) {
    return (
        <RACTreeLoadMoreItem
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.loadMore, className))}
        >
            {children ?? (
                <Loader2 className={styles.spinner} size={16} aria-label={loadingLabel} />
            )}
        </RACTreeLoadMoreItem>
    );
}
TreeLoadMoreItem.displayName = 'TreeLoadMoreItem';

export {
    Tree,
    TreeHeader,
    TreeItem,
    TreeItemContent,
    TreeLoadMoreItem,
    TreeSection,
};
