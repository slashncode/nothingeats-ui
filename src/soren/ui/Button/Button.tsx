'use client';

import type { VariantProps } from 'class-variance-authority';
import type { ButtonProps as RACButtonProps } from 'react-aria-components';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { composeRenderProps, Button as RACButton } from 'react-aria-components';

import styles from './Button.module.scss';

const buttonVariants = cva(styles.button, {
    variants: {
        variant: {
            primary: styles.primary,
            destructive: styles.destructive,
            outline: styles.outline,
            secondary: styles.secondary,
            ghost: styles.ghost,
            link: styles.link,
        },
        size: {
            md: styles.sizeMd,
            sm: styles.sizeSm,
            lg: styles.sizeLg,
            icon: styles.sizeIcon,
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});

export interface ButtonProps
    extends RACButtonProps,
    VariantProps<typeof buttonVariants> {
    ref?: React.RefObject<HTMLButtonElement | null>;
}

function Button({ ref, className, variant, size, ...props }: ButtonProps) {
    return (
        <RACButton
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(buttonVariants({ variant, size }), className))}
        />
    );
}
Button.displayName = 'Button';

export { Button, buttonVariants };
