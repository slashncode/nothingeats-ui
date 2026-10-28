'use client';

import clsx from 'clsx';
import { Flame } from 'lucide-react';

import { useStrings } from '../strings';
import styles from './StreakFlame.module.scss';

export interface StreakFlameProps {
    /** Days in a row with an order, as of today (0 once a day was missed). */
    days: number;
    orderedToday: boolean;
    className?: string;
}

/** The daily streak: a flame that burns while it runs, and what today means for it. */
function StreakFlame({ days, orderedToday, className }: StreakFlameProps) {
    const strings = useStrings();
    const hint = orderedToday
        ? strings.format('streak.today')
        : days > 0
            ? strings.format('streak.keep')
            : null;
    return (
        <div className={clsx(styles.streak, days > 0
            ? styles.lit
            : styles.out, className)}
        >
            <Flame aria-hidden className={styles.flame} />
            <div>
                <p className={styles.days}>
                    {days > 0
                        ? strings.format('streak.days', { days })
                        : strings.format('streak.none')}
                </p>
                {hint && <p className={styles.hint}>{hint}</p>}
            </div>
        </div>
    );
}
StreakFlame.displayName = 'StreakFlame';

export { StreakFlame };
