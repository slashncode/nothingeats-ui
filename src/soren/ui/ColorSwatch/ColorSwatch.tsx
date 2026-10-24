'use client';

import type { ColorSwatchProps as RACColorSwatchProps } from 'react-aria-components';
import clsx from 'clsx';
import { composeRenderProps, ColorSwatch as RACColorSwatch } from 'react-aria-components';

import styles from './ColorSwatch.module.scss';

export interface ColorSwatchProps extends RACColorSwatchProps {
    showAlphaPattern?: boolean;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ColorSwatch({ ref, className, showAlphaPattern = true, ...props }: ColorSwatchProps) {
    return (
        <RACColorSwatch
            ref={ref}
            {...props}
            data-alpha={showAlphaPattern}
            style={({ color }) => ({
                background: showAlphaPattern
                    ? `linear-gradient(${color}, ${color}),
            repeating-conic-gradient(oklch(0.85 0 0) 0% 25%, oklch(1 0 0) 0% 50%) 50% / 16px 16px`
                    : color.toString('css'),
            })}
            className={composeRenderProps(className, className =>
                clsx(styles.colorSwatch, className))}
        />
    );
}
ColorSwatch.displayName = 'ColorSwatch';

export { ColorSwatch };
