'use client';

import type { ProgressBarProps as RACProgressBarProps } from 'react-aria-components';
import clsx from 'clsx';
import { composeRenderProps, ProgressBar as RACProgressBar } from 'react-aria-components';

import { Label } from '../Field/Field';
import styles from './ProgressBar.module.scss';

export type ProgressBarSlots = 'header' | 'label' | 'value' | 'track' | 'fill';

export interface ProgressBarProps extends RACProgressBarProps {
    label?: string;
    classNames?: Partial<Record<ProgressBarSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ProgressBar({ ref, label, className, classNames, ...props }: ProgressBarProps) {
    return (
        <RACProgressBar
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.progressBar, className))}
        >
            {({ percentage, valueText, isIndeterminate }) => (
                <>
                    <div className={clsx(styles.header, classNames?.header)}>
                        {label && <Label className={classNames?.label}>{label}</Label>}
                        <span className={clsx(styles.value, classNames?.value)}>
                            {valueText}
                        </span>
                    </div>
                    <div
                        className={clsx(styles.track, classNames?.track)}
                        data-indeterminate={isIndeterminate || undefined}
                    >
                        <div
                            className={clsx(styles.fill, classNames?.fill)}
                            style={{
                                width: isIndeterminate ? undefined : `${percentage}%`,
                            }}
                        />
                    </div>
                </>
            )}
        </RACProgressBar>
    );
}
ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
