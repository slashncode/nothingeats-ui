'use client';

import clsx from 'clsx';
import { Check, Gift } from 'lucide-react';

import { useStrings } from '../strings';
import styles from './StampCard.module.scss';

export interface StampCardProps {
    restaurantName: string;
    stamps: number;
    perCard: number;
    /** Cards filled at this restaurant so far. */
    completed: number;
    headingLevel?: 3 | 4 | 5;
    className?: string;
}

/** A restaurant's stamp card: one stamp per delivery, a full card is a free dish there. */
function StampCard({ restaurantName, stamps, perCard, completed, headingLevel = 3, className }: StampCardProps) {
    const strings = useStrings();
    const Heading = `h${headingLevel}` as const;
    return (
        <article className={clsx(styles.card, className)}>
            <Heading className={styles.name}>{restaurantName}</Heading>
            <ol
                className={styles.slots}
                aria-label={strings.format('stamps.label', { restaurant: restaurantName, stamps, perCard })}
            >
                {Array.from({ length: perCard }, (_, index) => {
                    const stamped = index < stamps;
                    const last = index === perCard - 1;
                    return (
                        <li key={index} aria-hidden className={clsx(styles.slot, stamped && styles.stamped, last && styles.reward)}>
                            {stamped
                                ? <Check />
                                : last
                                    ? <Gift />
                                    : null}
                        </li>
                    );
                })}
            </ol>
            <p className={styles.meta}>
                {strings.format('stamps.reward')}
                {completed > 0 && ` · ${strings.format('stamps.completed', { count: completed })}`}
            </p>
        </article>
    );
}
StampCard.displayName = 'StampCard';

export { StampCard };
