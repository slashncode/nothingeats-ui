'use client';

import clsx from 'clsx';
import { useNumberFormatter } from 'react-aria';

import { ProgressBar } from '../../soren/ui/ProgressBar/ProgressBar';
import { useStrings } from '../strings';
import styles from './XpBar.module.scss';

export interface XpBarProps {
    level: number;
    xp: number;
    /** Total XP at which the current level began, and at which the next one begins. */
    levelStartXp: number;
    nextLevelXp: number;
    className?: string;
}

/** The level and the way to the next one, as a progress bar with a spoken value. */
function XpBar({ level, xp, levelStartXp, nextLevelXp, className }: XpBarProps) {
    const strings = useStrings();
    const number = useNumberFormatter();
    const into = Math.max(0, xp - levelStartXp);
    const needed = Math.max(1, nextLevelXp - levelStartXp);
    return (
        <div className={clsx(styles.xpBar, className)}>
            <span aria-hidden className={styles.level}>{level}</span>
            <ProgressBar
                className={styles.bar}
                classNames={{ fill: styles.fill, track: styles.track }}
                label={strings.format('xp.level', { level })}
                value={into}
                maxValue={needed}
                valueLabel={strings.format('xp.value', {
                    into: number.format(into),
                    needed: number.format(needed),
                    next: level + 1,
                })}
            />
        </div>
    );
}
XpBar.displayName = 'XpBar';

export { XpBar };
