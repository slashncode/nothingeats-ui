'use client';

import type { VariantProps } from 'class-variance-authority';
import type {
    MenuItemProps as RACMenuItemProps,
    MenuLoadMoreItemProps as RACMenuLoadMoreItemProps,
    MenuProps as RACMenuProps,
    MenuTriggerProps as RACMenuTriggerProps,
    SeparatorProps as RACSeparatorProps,
} from 'react-aria-components';
import type { buttonVariants } from '../Button/Button';
import type { PopoverProps } from '../Popover/Popover';

import clsx from 'clsx';
import { Check, ChevronRight, Dot, Loader2 } from 'lucide-react';
import * as React from 'react';
import {
    composeRenderProps,
    Collection as RACCollection,
    Header as RACHeader,
    Keyboard as RACKeyboard,
    Menu as RACMenu,
    MenuItem as RACMenuItem,
    MenuLoadMoreItem as RACMenuLoadMoreItem,
    MenuSection as RACMenuSection,
    MenuTrigger as RACMenuTrigger,
    Separator as RACSeparator,
    SubmenuTrigger as RACSubmenuTrigger,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { Popover } from '../Popover/Popover';
import styles from './Menu.module.scss';

const MenuTrigger = RACMenuTrigger;
const MenuSubTrigger = RACSubmenuTrigger;
const MenuSection = RACMenuSection;
const MenuCollection = RACCollection;

// These are bare re-exports of React Aria components whose bundled `.name` is a
// mangled id; label them so generated/devtools output shows readable tags.
(MenuTrigger as { displayName?: string }).displayName = 'MenuTrigger';
(MenuSubTrigger as { displayName?: string }).displayName = 'MenuSubTrigger';

export type ContextMenuTriggerProps = Omit<RACMenuTriggerProps, 'trigger'>;

// Lets MenuPopover know it is positioning at a pointer/keyboard point rather than
// alongside a trigger element, so it can drop the usual 8px gap.
const IsContextMenuContext = React.createContext(false);

/**
 * Opens its menu on right-click (mouse), long press (touch), or the platform's context
 * menu key / screen reader gesture (Shift+F10, or Ctrl+Enter on macOS). The first child
 * is the target region, the second is a `MenuPopover`.
 *
 * The target must be a **React Aria pressable**, not merely a focusable DOM node:
 * MenuTrigger passes the contextmenu and keyboard handlers down through
 * `PressResponderContext`, which only a `usePress`-based child reads. Use `Button`, a
 * collection item, or wrap custom markup in RAC's `Pressable` (which must itself render
 * a focusable element with an interactive ARIA role). A bare `<button>` or `<div>`
 * silently receives nothing.
 */
function ContextMenuTrigger(props: ContextMenuTriggerProps) {
    return (
        <IsContextMenuContext value={true}>
            <MenuTrigger {...props} trigger="contextMenu" />
        </IsContextMenuContext>
    );
}
ContextMenuTrigger.displayName = 'ContextMenuTrigger';

export type MenuKeyboardProps = React.ComponentProps<typeof RACKeyboard>;

/**
 * Displays a keyboard shortcut hint inside a `MenuItem` — the `shortcut` slot. Renders a
 * `<kbd>`; pass `formatKeyboardShortcut('Mod+s')` for a platform-correct label. This is
 * a label only: bind the shortcut itself with `useKeyboardShortcuts`.
 */
function MenuKeyboard({ className, ...props }: MenuKeyboardProps) {
    return <RACKeyboard {...props} className={clsx(styles.keyboard, className)} />;
}
MenuKeyboard.displayName = 'MenuKeyboard';

// Tracks submenu nesting depth. 0 = root menu, 1 = first submenu, 2 = second, …
const MenuLevelContext = React.createContext(0);

function MenuPopover({ className, showArrow = false, offset, ...props }: PopoverProps) {
    const level = React.use(MenuLevelContext);
    const isContextMenu = React.use(IsContextMenuContext);
    const isSubmenu = level > 0;
    // A context menu is positioned at the pointer, so React Aria sets offset 0 on
    // PopoverContext — but Popover passes its own default explicitly, which would win.
    // Restate it here so the menu lands on the click point rather than 8px below it.
    const resolvedOffset = offset ?? (isSubmenu ? 12 : isContextMenu ? 0 : undefined);

    return (
        <MenuLevelContext value={level + 1}>
            <Popover
                {...props}
                offset={resolvedOffset}
                showArrow={showArrow}
                className={composeRenderProps(className, className =>
                    clsx(
                        styles.menuPopover,
                        isSubmenu && styles.subMenu,
                        isSubmenu && styles[`subMenuLevel${level}`],
                        className,
                    ))}
            />
        </MenuLevelContext>
    );
}
MenuPopover.displayName = 'MenuPopover';

export type MenuSlots = 'menu';

export interface MenuProps<T extends object> extends RACMenuProps<T> {
    classNames?: Partial<Record<MenuSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

/**
 * A list of actions. Pass `renderEmptyState` to show a message (or a loading indicator)
 * when the collection is empty — the root then carries `data-empty` and centres it.
 */
function Menu<T extends object>({ ref, className, classNames, ...props }: MenuProps<T>) {
    return (
        <RACMenu
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.menu, classNames?.menu, className))}
        />
    );
}
Menu.displayName = 'Menu';

export interface MenuLoadMoreItemProps extends RACMenuLoadMoreItemProps {
    /** Accessible label announced while loading. */
    loadingLabel?: string;
}

/**
 * Render as the last child of a `Menu` to enable infinite scrolling. React Aria calls
 * `onLoadMore` when the sentinel scrolls into view; the spinner row only renders while
 * `isLoading` is true. Pass both from your data-fetching library (e.g. `useAsyncList`).
 */
function MenuLoadMoreItem({ children, className, loadingLabel = 'Loading more…', ...props }: MenuLoadMoreItemProps) {
    return (
        <RACMenuLoadMoreItem {...props} className={clsx(styles.loadMore, className)}>
            {children ?? (
                <Loader2 className={styles.spinner} size={16} aria-label={loadingLabel} />
            )}
        </RACMenuLoadMoreItem>
    );
}
MenuLoadMoreItem.displayName = 'MenuLoadMoreItem';

export type MenuItemSlots = 'item' | 'icon' | 'label' | 'shortcut' | 'submenuIndicator';

export interface MenuItemProps extends RACMenuItemProps {
    /**
     * A keyboard shortcut hint, rendered right-aligned as a `<kbd>`. Pass
     * `formatKeyboardShortcut('Mod+s')` for a platform-correct label. Display only —
     * bind the shortcut itself with `useKeyboardShortcuts`.
     */
    shortcut?: React.ReactNode;
    classNames?: Partial<Record<MenuItemSlots, string>>;
}

function MenuItem({ children, className, classNames, shortcut, ...props }: MenuItemProps) {
    return (
        <RACMenuItem
            {...props}
            textValue={
                props.textValue || (typeof children === 'string' ? children : undefined)
            }
            className={composeRenderProps(className, className =>
                clsx(styles.menuItem, classNames?.item, className))}
        >
            {composeRenderProps(children, (children, renderProps) => (
                <>
                    <span className={clsx(styles.iconWrapper, classNames?.icon)}>
                        {renderProps.isSelected && (
                            <>
                                {renderProps.selectionMode === 'single' && (
                                    <Dot aria-hidden size={16} className="fill-current" />
                                )}
                                {renderProps.selectionMode === 'multiple' && (
                                    <Check aria-hidden size={16} />
                                )}
                            </>
                        )}
                    </span>

                    {children}

                    {shortcut != null && shortcut !== '' && (
                        <MenuKeyboard className={classNames?.shortcut}>{shortcut}</MenuKeyboard>
                    )}

                    {renderProps.hasSubmenu && (
                        <ChevronRight
                            aria-hidden
                            className={clsx(styles.chevron, classNames?.submenuIndicator)}
                        />
                    )}
                </>
            ))}
        </RACMenuItem>
    );
}
MenuItem.displayName = 'MenuItem';

interface MenuHeaderProps extends React.ComponentProps<typeof RACHeader> {
    inset?: boolean;
    separator?: boolean;
}

function MenuHeader({ className, inset, separator = true, ...props }: MenuHeaderProps) {
    return (
        <RACHeader
            {...props}
            className={clsx(
                styles.header,
                inset && styles.headerInset,
                separator && styles.headerSeparator,
                className,
            )}
        />
    );
}
MenuHeader.displayName = 'MenuHeader';

function MenuSeparator({ className, ...props }: RACSeparatorProps) {
    return <RACSeparator {...props} className={clsx(styles.separator, className)} />;
}
MenuSeparator.displayName = 'MenuSeparator';

export type MenuButtonSlots = 'trigger' | 'menu' | 'popover';

interface MenuButtonProps<T>
    extends RACMenuProps<T>,
    VariantProps<typeof buttonVariants>,
    Omit<RACMenuTriggerProps, 'children'> {
    buttonLabel?: string;
    classNames?: Partial<Record<MenuButtonSlots, string>>;
    showArrow?: boolean;
}

function MenuButton<T extends object>({
    buttonLabel,
    children,
    variant,
    size,
    classNames,
    showArrow = false,
    // MenuTrigger-only props — kept off the inner Menu to avoid leaking them onto the RACMenu DOM node.
    isOpen,
    defaultOpen,
    onOpenChange,
    trigger,
    ...menuProps
}: MenuButtonProps<T>) {
    return (
        <MenuTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange} trigger={trigger}>
            <Button variant={variant} size={size} className={classNames?.trigger}>
                {buttonLabel}
            </Button>
            <MenuPopover className={clsx(styles.menuPopover, classNames?.popover)} showArrow={showArrow}>
                <Menu {...menuProps} className={classNames?.menu}>{children}</Menu>
            </MenuPopover>
        </MenuTrigger>
    );
}
MenuButton.displayName = 'MenuButton';

export {
    ContextMenuTrigger,
    Menu,
    MenuButton,
    MenuCollection,
    MenuHeader,
    MenuItem,
    MenuKeyboard,
    MenuLoadMoreItem,
    MenuPopover,
    MenuSection,
    MenuSeparator,
    MenuSubTrigger,
    MenuTrigger,
};
export type { MenuButtonProps, MenuHeaderProps };
