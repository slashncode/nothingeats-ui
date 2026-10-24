'use client';

import type { MeterProps as RACMeterProps } from 'react-aria-components';
import clsx from 'clsx';
import { composeRenderProps, Meter as RACMeter } from 'react-aria-components';

import { Label } from '../Field/Field';
import styles from './Meter.module.scss';

export interface MeterThreshold {
    threshold: number;
    color: string;
}

export type MeterSlots = 'header' | 'label' | 'value' | 'track' | 'fill';

export interface MeterProps extends RACMeterProps {
    label?: string;
    colorConfig?: MeterThreshold[];
    classNames?: Partial<Record<MeterSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Meter({ ref, label, className, classNames, colorConfig, ...props }: MeterProps) {
    return (
        <RACMeter
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.meter, className))}
        >
            {({ percentage, valueText }) => {
                const activeThreshold = colorConfig
                    ?.slice()
                    .sort((a, b) => b.threshold - a.threshold)
                    .find(t => percentage >= t.threshold);

                return (
                    <>
                        <div className={clsx(styles.header, classNames?.header)}>
                            {label && <Label className={classNames?.label}>{label}</Label>}
                            <span className={clsx(styles.value, classNames?.value)}>
                                {valueText}
                            </span>
                        </div>
                        <div className={clsx(styles.track, classNames?.track)}>
                            <div
                                className={clsx(styles.fill, classNames?.fill)}
                                style={{
                                    width: `${percentage}%`,
                                    ...(activeThreshold && {
                                        backgroundColor: activeThreshold.color,
                                    }),
                                } as React.CSSProperties}
                            />
                        </div>
                    </>
                );
            }}
        </RACMeter>
    );
}
Meter.displayName = 'Meter';

export { Meter };
