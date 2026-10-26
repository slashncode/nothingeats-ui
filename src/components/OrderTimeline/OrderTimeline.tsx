'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useDateFormatter } from 'react-aria';

import { useStrings } from '../strings';
import styles from './OrderTimeline.module.scss';

export const ORDER_STEPS = [
    'PLACED',
    'ACCEPTED',
    'COOKING',
    'PICKED_UP',
    'EN_ROUTE',
    'DELIVERED',
] as const;
export type OrderStep = (typeof ORDER_STEPS)[number];

export interface OrderTimelineProps {
    status: OrderStep;
    /** When each step happened or is planned (ISO); unknown steps show no time. */
    times?: Partial<Record<OrderStep, string>>;
    className?: string;
}

/** The order's steps, done ones checked, the current one marked for screen readers too. */
function OrderTimeline({ status, times = {}, className }: OrderTimelineProps) {
    const strings = useStrings();
    const time = useDateFormatter({ timeStyle: 'short' });
    const current = ORDER_STEPS.indexOf(status);
    return (
        <ol aria-label={strings.format('order.steps')} className={clsx(styles.timeline, className)}>
            {ORDER_STEPS.map((step, index) => {
                const at = times[step];
                return (
                    <li
                        key={step}
                        aria-current={index === current
                            ? 'step'
                            : undefined}
                        className={clsx(styles.step, index < current && styles.done, index === current && styles.current)}
                    >
                        <span className={styles.dot} aria-hidden>{index <= current && <Check size={14} />}</span>
                        <span className={styles.label}>{strings.format(`order.${step}`)}</span>
                        {at && <time dateTime={at} className={styles.time}>{time.format(new Date(at))}</time>}
                    </li>
                );
            })}
        </ol>
    );
}
OrderTimeline.displayName = 'OrderTimeline';

export { OrderTimeline };
