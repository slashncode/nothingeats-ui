'use client';

import type { TooltipProps as RACTooltipProps } from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    OverlayArrow,
    Tooltip as RACTooltip,
    TooltipTrigger as RACTooltipTrigger,
} from 'react-aria-components';

import styles from './Tooltip.module.scss';

// Thin wrapper so the bundled RAC name (a mangled id) shows as `TooltipTrigger`
// in the showcase's generated code and React devtools.
function TooltipTrigger(props: React.ComponentProps<typeof RACTooltipTrigger>) {
    return <RACTooltipTrigger {...props} />;
}
TooltipTrigger.displayName = 'TooltipTrigger';

export type TooltipSlots = 'tooltip' | 'arrow';

export interface TooltipProps extends Omit<RACTooltipProps, 'children'> {
    children: React.ReactNode;
    showArrow?: boolean;
    classNames?: Partial<Record<TooltipSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Tooltip({
    ref,
    children,
    showArrow = true,
    className,
    classNames,
    ...props
}: TooltipProps) {
    return (
        <RACTooltip
            ref={ref}
            {...props}
            offset={props.offset ?? 10}
            className={composeRenderProps(className, className =>
                clsx(styles.tooltip, classNames?.tooltip, className))}
        >
            {showArrow && (
                <OverlayArrow className={clsx(styles.arrow, classNames?.arrow)}>
                    <svg width={8} height={8} viewBox="0 0 8 8" aria-hidden>
                        <path d="M0 0 L4 4 L8 0" />
                    </svg>
                </OverlayArrow>
            )}
            {children}
        </RACTooltip>
    );
}
Tooltip.displayName = 'Tooltip';

export { Tooltip, TooltipTrigger };
