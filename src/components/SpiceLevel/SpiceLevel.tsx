'use client';

import clsx from 'clsx';
import { Flame } from 'lucide-react';

import { useStrings } from '../strings';
import styles from './SpiceLevel.module.scss';

export interface SpiceLevelProps {
    ref?: React.RefObject<HTMLSpanElement | null>;
    /** 0 (mild) to 3 (very spicy) */
    level: number;
    className?: string;
}

/** Three flames, as many lit as the dish is hot; announced as one label. */
function SpiceLevel({ ref, level, className }: SpiceLevelProps) {
    const strings = useStrings();
    const clamped = Math.max(0, Math.min(3, Math.round(level)));
    const label = strings.format(`spice.${clamped}`);
    return (
        <span ref={ref} role="img" aria-label={label} title={label} data-level={clamped} className={clsx(styles.spiceLevel, className)}>
            {[1, 2, 3].map(flame => (
                <Flame key={flame} aria-hidden className={clsx(styles.flame, flame <= clamped && styles.lit)} />
            ))}
        </span>
    );
}
SpiceLevel.displayName = 'SpiceLevel';

export { SpiceLevel };
