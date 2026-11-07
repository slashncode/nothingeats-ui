'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Zap } from 'lucide-react';
import { createContext, use } from 'react';
import { useDateFormatter, useNumberFormatter, VisuallyHidden } from 'react-aria';

import { useStrings } from '../strings';
import styles from './DealBadge.module.scss';
import { clock, useCountdown } from './useCountdown';

/** How a deal shows its end: a ticking `clock` ("noch 12:34") or the time it ends (`until`, "bis 23:59 Uhr"). */
export type DealCountdown = 'clock' | 'until';

const DealCountdownContext = createContext<DealCountdown>('clock');

/** Sets how the deal badges below show their end, e.g. per experiment variant. */
export function DealCountdownProvider({ value, children }: { value: DealCountdown; children: ReactNode }) {
    return <DealCountdownContext value={value}>{children}</DealCountdownContext>;
}

export interface DealBadgeProps {
    percentOff: number;
    /** When the deal ends (ISO). */
    endsAt: string;
    /** Defaults to the nearest DealCountdownProvider, else `clock`. */
    countdown?: DealCountdown;
    /** The clock, for stories and tests. */
    now?: () => number;
    className?: string;
}

/**
 * A flash deal's discount and how long it still runs. The only urgency is the clock: there is no
 * stock, a restaurant always has food. Screen readers get one sentence in whole minutes, not a
 * ticking number, whichever way the badge shows the end.
 */
function DealBadge({ percentOff, endsAt, countdown, now, className }: DealBadgeProps) {
    const strings = useStrings();
    const style = countdown ?? use(DealCountdownContext);
    const remaining = useCountdown(endsAt, now);
    const minutes = useNumberFormatter({ style: 'unit', unit: 'minute', unitDisplay: 'long' });
    // Deals run on Hamburg's clock, whatever the visitor's time zone.
    const time = useDateFormatter({ hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
    const over = remaining === 0;
    return (
        <span className={clsx(styles.badge, over && styles.over, className)}>
            <span aria-hidden className={styles.visible}>
                <Zap className={styles.icon} />
                <span className={styles.percent}>{strings.format('deal.badge', { percent: percentOff })}</span>
                <span className={styles.time}>
                    {over
                        ? strings.format('deal.over')
                        : style === 'until'
                            ? strings.format('deal.until', {
                                    time: time.format(new Date(endsAt)),
                                })
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
