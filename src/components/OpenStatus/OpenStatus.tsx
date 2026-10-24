'use client';

import clsx from 'clsx';
import { useDateFormatter } from 'react-aria';

import { timeOfDay } from '../catalog';
import { useStrings } from '../strings';
import styles from './OpenStatus.module.scss';

export interface OpenStatusProps {
    ref?: React.RefObject<HTMLSpanElement | null>;
    open: boolean;
    /** `HH:mm`; shown while closed */
    opensAt?: string;
    className?: string;
}

function OpenStatus({ ref, open, opensAt, className }: OpenStatusProps) {
    const strings = useStrings();
    const time = useDateFormatter({ hour: 'numeric', minute: '2-digit' });
    const opening = opensAt
        ? timeOfDay(opensAt)
        : undefined;
    const text = open
        ? strings.format('status.open')
        : opening
            ? strings.format('status.opensAt', {
                    time: time.format(opening),
                })
            : strings.format('status.closed');
    return (
        <span ref={ref} data-open={open} className={clsx(styles.status, open ? styles.open : styles.closed, className)}>
            <span aria-hidden className={styles.dot} />
            {text}
        </span>
    );
}
OpenStatus.displayName = 'OpenStatus';

export { OpenStatus };
