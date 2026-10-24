'use client';

import type { PopoverProps as RACPopoverProps } from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    DialogTrigger,
    OverlayArrow,
    Popover as RACPopover,
} from 'react-aria-components';

import { Dialog } from '../Dialog/Dialog';
import styles from './Popover.module.scss';

// Thin wrapper (a distinct component from DialogTrigger) so the showcase's
// generated code shows `PopoverTrigger` rather than RAC's mangled bundle name.
function PopoverTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
    return <DialogTrigger {...props} />;
}
PopoverTrigger.displayName = 'PopoverTrigger';

export type PopoverSlots = 'popover' | 'arrow';

export interface PopoverProps extends RACPopoverProps {
    showArrow?: boolean;
    classNames?: Partial<Record<PopoverSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Popover({
    ref,
    className,
    classNames,
    offset = 8,
    showArrow = true,
    ...props
}: PopoverProps) {
    const finalOffset = showArrow ? offset + 4 : offset;

    return (
        <RACPopover
            ref={ref}
            {...props}
            offset={finalOffset}
            className={composeRenderProps(className, className =>
                clsx(styles.popover, classNames?.popover, className))}
        >
            {composeRenderProps(props.children, (children, renderProps) => (
                <>
                    {showArrow && (
                        <OverlayArrow className={clsx(styles.arrow, classNames?.arrow)}>
                            <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden>
                                <path d="M0 0 L6 6 L12 0" />
                            </svg>
                        </OverlayArrow>
                    )}
                    {children}
                </>
            ))}
        </RACPopover>
    );
}
Popover.displayName = 'Popover';

export { Popover, Dialog as PopoverDialog, PopoverTrigger };
