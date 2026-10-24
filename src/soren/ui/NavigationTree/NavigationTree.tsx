'use client';

import type {
    LinkProps as RACLinkProps,
    NavigationTreeHeaderProps as RACNavigationTreeHeaderProps,
    NavigationTreeItemContentProps as RACNavigationTreeItemContentProps,
    NavigationTreeItemProps as RACNavigationTreeItemProps,
    NavigationTreeProps as RACNavigationTreeProps,
    NavigationTreeSectionProps as RACNavigationTreeSectionProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import {
    composeRenderProps,
    Link as RACLink,
    NavigationTree as RACNavigationTree,
    NavigationTreeHeader as RACNavigationTreeHeader,
    NavigationTreeItem as RACNavigationTreeItem,
    NavigationTreeItemContent as RACNavigationTreeItemContent,
    NavigationTreeSection as RACNavigationTreeSection,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import styles from './NavigationTree.module.scss';

// Carries NavigationTree's `renderLink` down to every NavigationTreeItemLink, so a
// router's link component is wired up once instead of per item.
const RenderLinkContext = React.createContext<RACLinkProps['render'] | undefined>(undefined);

export type NavigationTreeSlots = 'tree';

export interface NavigationTreeProps<T extends object> extends RACNavigationTreeProps<T> {
    /**
     * Default `render` for every `NavigationTreeItemLink` — delegate to your router's link
     * component here (`props => <NextLink {...props} />`). A link's own `render` wins.
     */
    renderLink?: RACLinkProps['render'];
    classNames?: Partial<Record<NavigationTreeSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

/**
 * A hierarchical set of links for sidebars and app navigation. Set `selectedRoute` to the
 * current path: the item whose `href` matches gets `aria-current="page"` and
 * `data-current`, and its collapsed ancestors get `data-current-ancestor`.
 */
function NavigationTree<T extends object>({
    ref,
    renderLink,
    className,
    classNames,
    ...props
}: NavigationTreeProps<T>) {
    return (
        <RenderLinkContext value={renderLink}>
            <RACNavigationTree
                ref={ref}
                {...props}
                className={composeRenderProps(className, className =>
                    clsx(styles.navigationTree, classNames?.tree, className))}
            />
        </RenderLinkContext>
    );
}
NavigationTree.displayName = 'NavigationTree';

export type NavigationTreeItemSlots = 'item';

export interface NavigationTreeItemProps<T extends object = object> extends RACNavigationTreeItemProps<T> {
    classNames?: Partial<Record<NavigationTreeItemSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

/**
 * One row. Give it an `href` to make it a route; without one it is a group label whose
 * link toggles its children. Nest further `NavigationTreeItem`s after the content.
 */
function NavigationTreeItem<T extends object = object>({
    ref,
    className,
    classNames,
    ...props
}: NavigationTreeItemProps<T>) {
    return (
        <RACNavigationTreeItem
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.item, classNames?.item, className))}
        />
    );
}
NavigationTreeItem.displayName = 'NavigationTreeItem';

export type NavigationTreeItemContentSlots = 'chevron';

export interface NavigationTreeItemContentProps extends RACNavigationTreeItemContentProps {
    classNames?: Partial<Record<NavigationTreeItemContentSlots, string>>;
}

/**
 * The row's content: a `NavigationTreeItemLink` plus any trailing actions. Appends the
 * expand/collapse chevron, which is hidden (and disabled) on rows without children.
 */
function NavigationTreeItemContent({ children, classNames }: NavigationTreeItemContentProps) {
    return (
        <RACNavigationTreeItemContent>
            {composeRenderProps(children, (children, { hasChildItems }) => (
                <>
                    {children}
                    <Button
                        slot="chevron"
                        variant="ghost"
                        size="icon"
                        isDisabled={!hasChildItems}
                        className={clsx(
                            styles.chevron,
                            !hasChildItems && styles.chevronHidden,
                            classNames?.chevron,
                        )}
                    >
                        <ChevronRight className={styles.chevronIcon} aria-hidden />
                    </Button>
                </>
            ))}
        </RACNavigationTreeItemContent>
    );
}
NavigationTreeItemContent.displayName = 'NavigationTreeItemContent';

export interface NavigationTreeItemLinkProps extends RACLinkProps {
    ref?: React.RefObject<HTMLAnchorElement | null>;
}

/**
 * The row's link. Its `href`, `target`, `aria-current` and focus wiring come from the
 * enclosing `NavigationTreeItem` — do not set `href` here.
 */
function NavigationTreeItemLink({ ref, render, className, ...props }: NavigationTreeItemLinkProps) {
    const contextRender = React.use(RenderLinkContext);
    return (
        <RACLink
            ref={ref}
            {...props}
            render={render ?? contextRender}
            className={composeRenderProps(className, className =>
                clsx(styles.link, className))}
        />
    );
}
NavigationTreeItemLink.displayName = 'NavigationTreeItemLink';

// Groups items under an optional <NavigationTreeHeader>. Sections without a header
// must have an `aria-label`.
function NavigationTreeSection<T extends object>({ className, ...props }: RACNavigationTreeSectionProps<T>) {
    return <RACNavigationTreeSection {...props} className={clsx(styles.section, className)} />;
}
NavigationTreeSection.displayName = 'NavigationTreeSection';

function NavigationTreeHeader({ className, ...props }: RACNavigationTreeHeaderProps) {
    return <RACNavigationTreeHeader {...props} className={clsx(styles.header, className)} />;
}
NavigationTreeHeader.displayName = 'NavigationTreeHeader';

export {
    NavigationTree,
    NavigationTreeHeader,
    NavigationTreeItem,
    NavigationTreeItemContent,
    NavigationTreeItemLink,
    NavigationTreeSection,
};
