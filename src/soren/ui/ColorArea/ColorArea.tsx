'use client';

import type { ColorAreaProps as RACColorAreaProps } from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    ColorArea as RACColorArea,
    ColorThumb as RACColorThumb,
} from 'react-aria-components';

import styles from './ColorArea.module.scss';

export type ColorAreaSlots = 'thumb';

export interface ColorAreaProps extends RACColorAreaProps {
    classNames?: Partial<Record<ColorAreaSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ColorArea({ ref, className, classNames, ...props }: ColorAreaProps) {
    return (
        <RACColorArea
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.colorArea, className))}
            style={composeRenderProps(props.style, (style, { isDisabled, defaultStyle }) => ({
                ...defaultStyle,
                ...style,
                background: style?.background || defaultStyle.background,
            }))}
        >
            <RACColorThumb
                className={clsx(styles.colorThumb, classNames?.thumb)}
                style={({ defaultStyle, isDisabled }) => ({
                    ...defaultStyle,
                    backgroundColor: isDisabled ? undefined : defaultStyle.backgroundColor,
                })}
            />
        </RACColorArea>
    );
}
ColorArea.displayName = 'ColorArea';

export { ColorArea };
