'use client';

import clsx from 'clsx';
import { Star } from 'lucide-react';
import { useNumberFormatter } from 'react-aria';

import { useStrings } from '../strings';
import styles from './Rating.module.scss';

export interface RatingProps {
    ref?: React.RefObject<HTMLSpanElement | null>;
    /** 0 to 5 */
    value: number;
    className?: string;
}

function Rating({ ref, value, className }: RatingProps) {
    const strings = useStrings();
    const number = useNumberFormatter({ minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const formatted = number.format(value);
    return (
        <span ref={ref} role="img" aria-label={strings.format('rating.label', { value: formatted })} className={clsx(styles.rating, className)}>
            <Star aria-hidden className={styles.star} />
            <span aria-hidden>{formatted}</span>
        </span>
    );
}
Rating.displayName = 'Rating';

export { Rating };
