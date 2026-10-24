'use client';

import type { DropZoneProps as RACDropZoneProps } from 'react-aria-components';
import clsx from 'clsx';
import * as React from 'react';
import { composeRenderProps, DropZone as RACDropZone } from 'react-aria-components';

import styles from './DropZone.module.scss';

export type DropZoneSlots = 'dropZone' | 'label' | 'description';

export interface DropZoneProps extends RACDropZoneProps {
    label?: string;
    description?: string;
    classNames?: Partial<Record<DropZoneSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function DropZone({
    ref,
    label,
    description,
    className,
    classNames,
    children,
    ...props
}: DropZoneProps) {
    const labelId = React.useId();

    return (
        <RACDropZone
            ref={ref}
            {...props}
            aria-labelledby={label ? labelId : props['aria-labelledby']}
            className={composeRenderProps(className, className =>
                clsx(styles.dropZone, classNames?.dropZone, className))}
        >
            {composeRenderProps(children, children => (
                <>
                    {label && (
                        <span id={labelId} className={clsx(styles.label, classNames?.label)}>
                            {label}
                        </span>
                    )}
                    {description && (
                        <span className={clsx(styles.description, classNames?.description)}>
                            {description}
                        </span>
                    )}
                    {children}
                </>
            ))}
        </RACDropZone>
    );
}
DropZone.displayName = 'DropZone';

export { DropZone };
