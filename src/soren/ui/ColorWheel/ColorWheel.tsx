'use client';

import type { ColorWheelProps as RACColorWheelProps } from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    ColorThumb as RACColorThumb,
    ColorWheel as RACColorWheel,
    ColorWheelTrack as RACColorWheelTrack,
} from 'react-aria-components';

import styles from './ColorWheel.module.scss';

export type ColorWheelSlots = 'thumb' | 'track';

export interface ColorWheelProps
    extends Omit<RACColorWheelProps, 'outerRadius' | 'innerRadius' | 'children'> {
    outerRadius?: number;
    innerRadius?: number;
    classNames?: Partial<Record<ColorWheelSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ColorWheel({
    ref,
    outerRadius = 100,
    innerRadius = 74,
    className,
    classNames,
    ...props
}: ColorWheelProps) {
    return (
        <RACColorWheel
            ref={ref}
            {...props}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            className={composeRenderProps(className, className =>
                clsx(styles.colorWheel, className))}
        >
            <RACColorWheelTrack className={classNames?.track} />
            <RACColorThumb className={clsx(styles.colorThumb, classNames?.thumb)} />
        </RACColorWheel>
    );
}
ColorWheel.displayName = 'ColorWheel';

export { ColorWheel };
