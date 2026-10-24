'use client';

import type { VariantProps } from 'class-variance-authority';
import type {
    ToggleButtonGroupProps as RACToggleButtonGroupProps,
    ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import {
    composeRenderProps,
    ToggleButton as RACToggleButton,
    ToggleButtonGroup as RACToggleButtonGroup,
} from 'react-aria-components';

import styles from './ToggleButton.module.scss';

const toggleButtonVariants = cva(styles.toggleButton, {
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

export interface ToggleButtonProps
    extends RACToggleButtonProps,
    VariantProps<typeof toggleButtonVariants> {
    ref?: React.RefObject<HTMLButtonElement | null>;
}

function ToggleButton({ ref, className, variant, size, ...props }: ToggleButtonProps) {
    return (
        <RACToggleButton
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(toggleButtonVariants({ variant, size }), className))}
        />
    );
}
ToggleButton.displayName = 'ToggleButton';

export type ToggleButtonGroupSlots = 'group';

export interface ToggleButtonGroupProps extends RACToggleButtonGroupProps {
    attached?: boolean;
    classNames?: Partial<Record<ToggleButtonGroupSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ToggleButtonGroup({
    ref,
    className,
    classNames,
    attached = false,
    ...props
}: ToggleButtonGroupProps) {
    return (
        <RACToggleButtonGroup
            ref={ref}
            {...props}
            data-attached={attached}
            className={composeRenderProps(className, className =>
                clsx(styles.toggleGroup, classNames?.group, className))}
        />
    );
}
ToggleButtonGroup.displayName = 'ToggleButtonGroup';

export { ToggleButton, ToggleButtonGroup, toggleButtonVariants };
