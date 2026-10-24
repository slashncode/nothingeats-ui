'use client';

import type { SeparatorProps as RACSeparatorProps } from 'react-aria-components';
import clsx from 'clsx';
import { Separator as RACSeparator } from 'react-aria-components';

import styles from './Separator.module.scss';

export interface SeparatorProps extends RACSeparatorProps {
    ref?: React.RefObject<HTMLElement | null>;
}

function Separator({ ref, className, ...props }: SeparatorProps) {
    return (
        <RACSeparator
            ref={ref as React.Ref<any>}
            {...props}
            className={clsx(styles.separator, className)}
        />
    );
}
Separator.displayName = 'Separator';

export { Separator };
