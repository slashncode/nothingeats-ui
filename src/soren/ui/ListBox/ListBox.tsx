'use client';

import type {
    ListBoxItemProps as RACListBoxItemProps,
    ListBoxProps as RACListBoxProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import {
    composeRenderProps,
    ListBox as RACListBox,
    ListBoxItem as RACListBoxItem,
    Text as RACText,
} from 'react-aria-components';

import styles from './ListBox.module.scss';

export type ListBoxSlots = 'list';

export interface ListBoxProps<T extends object> extends RACListBoxProps<T> {
    classNames?: Partial<Record<ListBoxSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ListBox<T extends object>({
    ref,
    children,
    className,
    classNames,
    ...props
}: ListBoxProps<T>) {
    return (
        <RACListBox
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.listBox, classNames?.list, className))}
        >
            {children}
        </RACListBox>
    );
}
ListBox.displayName = 'ListBox';

export type ListBoxItemSlots = 'item' | 'check' | 'label';

export interface ListBoxItemProps extends RACListBoxItemProps {
    classNames?: Partial<Record<ListBoxItemSlots, string>>;
}

function ListBoxItem({ children, className, classNames, ...props }: ListBoxItemProps) {
    return (
        <RACListBoxItem
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.listBoxItem, classNames?.item, className))}
        >
            {children}
        </RACListBoxItem>
    );
}
ListBoxItem.displayName = 'ListBoxItem';

function DropdownListBox<T extends object>(props: ListBoxProps<T>) {
    return (
        <ListBox
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.dropdownListBox, className))}
        />
    );
}
DropdownListBox.displayName = 'DropdownListBox';

function DropdownItem({ className, classNames, ...props }: ListBoxItemProps) {
    const textValue
        = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
    return (
        <RACListBoxItem
            {...props}
            textValue={textValue}
            className={composeRenderProps(className, className =>
                clsx(styles.listBoxItem, styles.dropdownItem, classNames?.item, className))}
        >
            {composeRenderProps(props.children, (children, { isSelected }) => (
                <>
                    {typeof children === 'string'
                        ? <RACText slot="label" className={classNames?.label}>{children}</RACText>
                        : children}
                    {isSelected && (
                        <span className={clsx(styles.check, classNames?.check)}>
                            <Check size={16} aria-hidden />
                        </span>
                    )}
                </>
            ))}
        </RACListBoxItem>
    );
}
DropdownItem.displayName = 'DropdownItem';

export { DropdownItem, DropdownListBox, ListBox, ListBoxItem };
