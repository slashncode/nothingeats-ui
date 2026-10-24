'use client';

import type {
    ColorSwatchPickerItemProps as RACColorSwatchPickerItemProps,
    ColorSwatchPickerProps as RACColorSwatchPickerProps,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    ColorSwatchPicker as RACColorSwatchPicker,
    ColorSwatchPickerItem as RACColorSwatchPickerItem,
} from 'react-aria-components';

import { ColorSwatch } from '../ColorSwatch/ColorSwatch';
import styles from './ColorSwatchPicker.module.scss';

export type ColorSwatchPickerSlots = 'list';

export interface ColorSwatchPickerProps extends RACColorSwatchPickerProps {
    classNames?: Partial<Record<ColorSwatchPickerSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ColorSwatchPicker({
    ref,
    children,
    className,
    classNames,
    layout = 'grid',
    ...props
}: ColorSwatchPickerProps) {
    return (
        <RACColorSwatchPicker
            ref={ref}
            layout={layout}
            {...props}
            // RAC doesn't render the layout onto the DOM, so expose it for styling.
            data-layout={layout}
            className={composeRenderProps(className, className =>
                clsx(styles.picker, classNames?.list, className))}
        >
            {children}
        </RACColorSwatchPicker>
    );
}
ColorSwatchPicker.displayName = 'ColorSwatchPicker';

export type ColorSwatchPickerItemSlots = 'item' | 'swatch';

export interface ColorSwatchPickerItemProps extends RACColorSwatchPickerItemProps {
    classNames?: Partial<Record<ColorSwatchPickerItemSlots, string>>;
}

function ColorSwatchPickerItem({
    children,
    className,
    classNames,
    ...props
}: ColorSwatchPickerItemProps) {
    return (
        <RACColorSwatchPickerItem
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.item, classNames?.item, className))}
        >
            {children || <ColorSwatch className={classNames?.swatch} />}
        </RACColorSwatchPickerItem>
    );
}
ColorSwatchPickerItem.displayName = 'ColorSwatchPickerItem';

export { ColorSwatchPicker, ColorSwatchPickerItem };
