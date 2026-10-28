'use client';

import clsx from 'clsx';
import { Zap } from 'lucide-react';
import { useNumberFormatter, VisuallyHidden } from 'react-aria';

import { useStrings } from '../strings';
import styles from './DealBadge.module.scss';
import { clock, useCountdown } from './useCountdown';

export interface DealBadgeProps {
    percentOff: number;
    /** When the deal ends (ISO). */
    endsAt: string;
    /** The clock, for stories and tests. */
    now?: () => number;
    className?: string;
}

/**
 * A flash deal's discount and how long it still runs. The only urgency is the clock: there is no
 * stock, a restaurant always has food. Screen readers get one sentence in whole minutes, not a
 * ticking number.
 */
function DealBadge({ percentOff, endsAt, now, className }: DealBadgeProps) {
    const strings = useStrings();
    const remaining = useCountdown(endsAt, now);
    const minutes = useNumberFormatter({ style: 'unit', unit: 'minute', unitDisplay: 'long' });
    const over = remaining === 0;
    return (
        <span className={clsx(styles.badge, over && styles.over, className)}>
            <span aria-hidden className={styles.visible}>
                <Zap className={styles.icon} />
                <span className={styles.percent}>{strings.format('deal.badge', { percent: percentOff })}</span>
                <span className={styles.time}>
                    {over
                        ? strings.format('deal.over')
                        : strings.format('deal.ends', {
                                time: clock(remaining),
                            })}
                </span>
            </span>
            <VisuallyHidden>
                {over
                    ? strings.format('deal.over')
                    : strings.format('deal.label', {
                            percent: percentOff,
                            time: minutes.format(Math.max(1, Math.ceil(remaining / 60_000))),
                        })}
            </VisuallyHidden>
        </span>
    );
}
DealBadge.displayName = 'DealBadge';

export { DealBadge };
