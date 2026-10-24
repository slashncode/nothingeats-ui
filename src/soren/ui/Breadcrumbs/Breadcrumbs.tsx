'use client';

import type {
    BreadcrumbProps as RACBreadcrumbProps,
    BreadcrumbsProps as RACBreadcrumbsProps,
} from 'react-aria-components';
import type { LinkProps } from '../Link/Link';
import clsx from 'clsx';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import {
    composeRenderProps,
    Breadcrumb as RACBreadcrumb,
    Breadcrumbs as RACBreadcrumbs,
    VisuallyHidden,
} from 'react-aria-components';

import { Link } from '../Link/Link';
import styles from './Breadcrumbs.module.scss';

export type BreadcrumbsSlots = 'list';

export interface BreadcrumbsProps<T extends object> extends RACBreadcrumbsProps<T> {
    classNames?: Partial<Record<BreadcrumbsSlots, string>>;
    ref?: React.RefObject<HTMLOListElement | null>;
}

function Breadcrumbs<T extends object>({
    ref,
    className,
    classNames,
    ...props
}: BreadcrumbsProps<T>) {
    return (
        <RACBreadcrumbs
            ref={ref}
            {...props}
            className={clsx(styles.breadcrumbs, classNames?.list, className)}
        />
    );
}
Breadcrumbs.displayName = 'Breadcrumbs';

function BreadcrumbItem({ className, ...props }: RACBreadcrumbProps) {
    return (
        <RACBreadcrumb
            {...props}
            className={clsx(styles.item, className)}
        />
    );
}
BreadcrumbItem.displayName = 'BreadcrumbItem';

function BreadcrumbLink({ className, ...props }: LinkProps) {
    return (
        <Link
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.link, className))}
        />
    );
}
BreadcrumbLink.displayName = 'BreadcrumbLink';

function BreadcrumbSeparator({
    children,
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            role="presentation"
            aria-hidden="true"
            className={clsx(styles.separator, className)}
            {...props}
        >
            {children || <ChevronRight aria-hidden />}
        </span>
    );
}
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            role="presentation"
            aria-hidden="true"
            className={clsx(styles.ellipsis, className)}
            {...props}
        >
            <MoreHorizontal aria-hidden className={styles.ellipsisIcon} />
            <VisuallyHidden><span>More</span></VisuallyHidden>
        </span>
    );
}
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

interface BreadcrumbPageProps extends Omit<LinkProps, 'href'> {}

function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
    return (
        <Link
            {...props}
            aria-current="page"
            className={composeRenderProps(className, className =>
                clsx(styles.page, className))}
        />
    );
}
BreadcrumbPage.displayName = 'BreadcrumbPage';

export {
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    Breadcrumbs,
    BreadcrumbSeparator,
};
