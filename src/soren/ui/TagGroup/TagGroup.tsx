'use client';

import type {
    TagGroupProps as RACTagGroupProps,
    TagListProps as RACTagListProps,
    TagProps as RACTagProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { X } from 'lucide-react';
import {
    composeRenderProps,
    Label as RACLabel,
    Tag as RACTag,
    TagGroup as RACTagGroup,
    TagList as RACTagList,
    Text as RACText,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import styles from './TagGroup.module.scss';

export type TagGroupSlots
    = | 'group'
        | 'list'
        | 'label'
        | 'description'
        | 'errorMessage';

export interface TagGroupProps<T>
    extends Omit<RACTagGroupProps, 'children'>,
    Pick<RACTagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
    label?: string;
    description?: string;
    errorMessage?: string;
    classNames?: Partial<Record<TagGroupSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function TagGroup<T extends object>({
    ref,
    label,
    description,
    errorMessage,
    items,
    children,
    renderEmptyState,
    className,
    classNames,
    ...props
}: TagGroupProps<T>) {
    return (
        <RACTagGroup
            ref={ref}
            {...props}
            className={clsx(styles.tagGroup, classNames?.group, className)}
        >
            {label && (
                <RACLabel className={clsx(styles.label, classNames?.label)}>{label}</RACLabel>
            )}
            <RACTagList
                items={items}
                renderEmptyState={renderEmptyState}
                className={clsx(styles.tagList, classNames?.list)}
            >
                {children}
            </RACTagList>
            {description && (
                <RACText
                    slot="description"
                    className={clsx(styles.description, classNames?.description)}
                >
                    {description}
                </RACText>
            )}
            {errorMessage && (
                <RACText
                    slot="errorMessage"
                    className={clsx(styles.errorMessage, classNames?.errorMessage)}
                >
                    {errorMessage}
                </RACText>
            )}
        </RACTagGroup>
    );
}
TagGroup.displayName = 'TagGroup';

export type TagSlots = 'tag' | 'removeButton';

export interface TagProps extends Omit<RACTagProps, 'children'> {
    children?: React.ReactNode;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    classNames?: Partial<Record<TagSlots, string>>;
}

function Tag({
    children,
    className,
    classNames,
    variant = 'default',
    ...props
}: TagProps) {
    const textValue = typeof children === 'string' ? children : undefined;
    return (
        <RACTag
            {...props}
            textValue={textValue}
            className={composeRenderProps(className, (className, renderProps) => {
                const effectiveVariant
                    = renderProps.selectionMode === 'none' || renderProps.isSelected
                        ? variant
                        : 'secondary';
                return clsx(styles.tag, styles[effectiveVariant], classNames?.tag, className);
            })}
        >
            {composeRenderProps(children, (children, { allowsRemoving }) => (
                <>
                    {children}
                    {allowsRemoving && (
                        <Button
                            slot="remove"
                            aria-label="Remove"
                            className={clsx(styles.removeButton, classNames?.removeButton)}
                        >
                            <X size={12} />
                        </Button>
                    )}
                </>
            ))}
        </RACTag>
    );
}
Tag.displayName = 'Tag';

export { Tag, TagGroup };
