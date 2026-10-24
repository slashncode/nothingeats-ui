'use client';

import type { ColorSliderProps as RACColorSliderProps } from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    ColorSlider as RACColorSlider,
    ColorThumb as RACColorThumb,
    Label as RACLabel,
    SliderOutput as RACSliderOutput,
    SliderTrack as RACSliderTrack,
} from 'react-aria-components';

import styles from './ColorSlider.module.scss';

export type ColorSliderSlots = 'header' | 'label' | 'output' | 'track' | 'thumb';

export interface ColorSliderProps extends RACColorSliderProps {
    label?: string;
    classNames?: Partial<Record<ColorSliderSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ColorSlider({ ref, label, className, classNames, ...props }: ColorSliderProps) {
    return (
        <RACColorSlider
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.colorSlider, className))}
        >
            <div className={clsx(styles.header, classNames?.header)}>
                {label && (
                    <RACLabel className={clsx(styles.label, classNames?.label)}>{label}</RACLabel>
                )}
                <RACSliderOutput className={clsx(styles.output, classNames?.output)} />
            </div>
            <RACSliderTrack
                className={clsx(styles.track, classNames?.track)}
                style={({ defaultStyle }) => ({
                    background: `${defaultStyle.background},
            repeating-conic-gradient(oklch(0.85 0 0) 0% 25%, oklch(1 0 0) 0% 50%) 50% / 16px 16px`,
                })}
            >
                <RACColorThumb className={clsx(styles.colorThumb, classNames?.thumb)} />
            </RACSliderTrack>
        </RACColorSlider>
    );
}
ColorSlider.displayName = 'ColorSlider';

export { ColorSlider };
