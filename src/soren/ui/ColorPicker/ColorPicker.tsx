'use client';

import type { ColorPickerProps as RACColorPickerProps } from 'react-aria-components';

import clsx from 'clsx';
import {
    ColorPicker as RACColorPicker,
    DialogTrigger as RACDialogTrigger,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { ColorArea } from '../ColorArea/ColorArea';
import { ColorField } from '../ColorField/ColorField';
import { ColorSlider } from '../ColorSlider/ColorSlider';
import { ColorSwatch } from '../ColorSwatch/ColorSwatch';
import { Popover } from '../Popover/Popover';
import styles from './ColorPicker.module.scss';

export type ColorPickerSlots = 'trigger' | 'popover' | 'content' | 'swatch';

export interface ColorPickerProps extends Omit<RACColorPickerProps, 'children'> {
    label?: string;
    children?: React.ReactNode;
    className?: string;
    isDisabled?: boolean;
    /** Add an opacity (alpha) slider to the default picker. Ignored when custom `children` are provided. */
    showAlpha?: boolean;
    classNames?: Partial<Record<ColorPickerSlots, string>>;
}

function ColorPicker({ label, children, className, classNames, isDisabled, showAlpha, ...props }: ColorPickerProps) {
    return (
        <RACColorPicker {...props}>
            <RACDialogTrigger>
                {label
                    ? (
                            <Button
                                variant="outline"
                                isDisabled={isDisabled}
                                className={clsx(styles.colorPickerButton, className, classNames?.trigger)}
                            >
                                <ColorSwatch className={classNames?.swatch} />
                                <span>{label}</span>
                            </Button>
                        )
                    : (
                            <Button
                                variant="ghost"
                                isDisabled={isDisabled}
                                className={clsx(className, classNames?.trigger)}
                            >
                                <ColorSwatch className={classNames?.swatch} />
                            </Button>
                        )}
                <Popover placement="bottom start" className={classNames?.popover}>
                    <div className={clsx(styles.content, classNames?.content)}>
                        {children || (
                            <>
                                <ColorArea
                                    colorSpace="hsb"
                                    xChannel="saturation"
                                    yChannel="brightness"
                                />
                                <ColorSlider colorSpace="hsb" channel="hue" />
                                {showAlpha && <ColorSlider colorSpace="hsb" channel="alpha" />}
                                <ColorField label="Hex" />
                            </>
                        )}
                    </div>
                </Popover>
            </RACDialogTrigger>
        </RACColorPicker>
    );
}
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
