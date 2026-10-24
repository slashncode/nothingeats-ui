'use client';

import type { VariantProps } from 'class-variance-authority';
import type { ToolbarProps as RACToolbarProps } from 'react-aria-components';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import {
    composeRenderProps,
    Toolbar as RACToolbar,
    SeparatorContext,
    ToggleButtonGroupContext,
} from 'react-aria-components';

import styles from './Toolbar.module.scss';

const toolbarVariants = cva(styles.toolbar, {
    variants: {
        gap: {
            sm: styles.gapSm,
            md: styles.gapMd,
            lg: styles.gapLg,
        },
    },
    defaultVariants: {
        gap: 'md',
    },
});

export interface ToolbarProps extends RACToolbarProps, VariantProps<typeof toolbarVariants> {
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Toolbar({ ref, className, gap, ...props }: ToolbarProps) {
    const { orientation = 'horizontal' } = props;

    return (
        <ToggleButtonGroupContext value={{ orientation }}>
            <SeparatorContext
                value={{
                    orientation: orientation === 'horizontal' ? 'vertical' : 'horizontal',
                }}
            >
                <RACToolbar
                    ref={ref}
                    {...props}
                    className={composeRenderProps(className, className =>
                        clsx(toolbarVariants({ gap }), className))}
                />
            </SeparatorContext>
        </ToggleButtonGroupContext>
    );
}
Toolbar.displayName = 'Toolbar';

export { Toolbar, toolbarVariants };
