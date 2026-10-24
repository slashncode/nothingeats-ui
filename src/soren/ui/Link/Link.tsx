'use client';

import type { VariantProps } from 'class-variance-authority';
import type { LinkProps as RACLinkProps } from 'react-aria-components';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { composeRenderProps, Link as RACLink } from 'react-aria-components';

import styles from './Link.module.scss';

const linkVariants = cva(styles.link, {
    variants: {
        variant: {
            default: '',
            secondary: styles.secondary,
            link: '',
        },
        size: {
            sm: styles.sizeSm,
            md: styles.sizeMd,
            lg: styles.sizeLg,
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});

export interface LinkProps
    extends RACLinkProps,
    VariantProps<typeof linkVariants> {
    ref?: React.RefObject<HTMLAnchorElement | null>;
}

function Link({ ref, className, variant, size, ...props }: LinkProps) {
    return (
        <RACLink
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(linkVariants({ variant, size }), className))}
        />
    );
}
Link.displayName = 'Link';

export { Link, linkVariants };
