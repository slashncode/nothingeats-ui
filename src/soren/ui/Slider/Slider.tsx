'use client';

import type { SliderProps as RACSliderProps } from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    Slider as RACSlider,
    SliderFill as RACSliderFill,
    SliderOutput as RACSliderOutput,
    SliderThumb as RACSliderThumb,
    SliderTrack as RACSliderTrack,
} from 'react-aria-components';

import { Label } from '../Field/Field';
import styles from './Slider.module.scss';

export type SliderSlots
    = | 'header'
        | 'label'
        | 'output'
        | 'track'
        | 'trackInternal'
        | 'fill'
        | 'thumb';

export interface SliderComponentProps<T> extends RACSliderProps<T> {
    label?: string;
    description?: string;
    thumbLabels?: string[];
    getValueLabel?: (value: number) => string;
    classNames?: Partial<Record<SliderSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Slider<T extends number | number[]>({
    ref,
    label,
    thumbLabels,
    getValueLabel,
    className,
    classNames,
    orientation = 'horizontal',
    ...props
}: SliderComponentProps<T>) {
    return (
        <RACSlider
            ref={ref}
            {...props}
            orientation={orientation}
            className={composeRenderProps(className, className =>
                clsx(styles.slider, className))}
        >
            <div className={clsx(styles.header, classNames?.header)}>
                {label && <Label className={classNames?.label}>{label}</Label>}
                <RACSliderOutput className={clsx(styles.output, classNames?.output)}>
                    {({ state }) =>
                        state.values
                            .map((v, i) =>
                                getValueLabel ? getValueLabel(v) : state.getThumbValueLabel(i),
                            )
                            .join(' – ')}
                </RACSliderOutput>
            </div>

            <RACSliderTrack className={clsx(styles.track, classNames?.track)}>
                {({ state }) => (
                    <>
                        <div className={clsx(styles.trackInternal, classNames?.trackInternal)} />
                        {/* SliderFill auto-computes the filled portion: 0→thumb for a single
                            value, or between the thumbs for a range (orientation/RTL aware). */}
                        <RACSliderFill className={clsx(styles.fill, classNames?.fill)} />
                        {state.values.map((_, i) => (
                            <RACSliderThumb
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                index={i}
                                aria-label={thumbLabels?.[i]}
                                className={clsx(styles.thumb, classNames?.thumb)}
                            />
                        ))}
                    </>
                )}
            </RACSliderTrack>
        </RACSlider>
    );
}
Slider.displayName = 'Slider';

export { Slider };
