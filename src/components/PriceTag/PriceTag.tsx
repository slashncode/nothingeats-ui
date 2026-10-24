'use client';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { useNumberFormatter, VisuallyHidden } from 'react-aria';

import { useStrings } from '../strings';
import styles from './PriceTag.module.scss';

const priceTagVariants = cva(styles.priceTag, {
    variants: {
        size: {
            sm: styles.sizeSm,
            md: styles.sizeMd,
            lg: styles.sizeLg,
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

export interface PriceTagProps extends VariantProps<typeof priceTagVariants> {
    ref?: React.RefObject<HTMLSpanElement | null>;
    /** Price in cents, never a float. */
    cents: number;
    /** Struck-through former price, shown only when it is higher. */
    previousCents?: number;
    currency?: string;
    className?: string;
}

function PriceTag({ ref, cents, previousCents, currency = 'EUR', size, className }: PriceTagProps) {
    const money = useNumberFormatter({ style: 'currency', currency });
    const strings = useStrings();
    return (
        <span ref={ref} className={clsx(priceTagVariants({ size }), className)}>
            <data className={styles.price} value={(cents / 100).toFixed(2)}>
                {money.format(cents / 100)}
            </data>
            {previousCents !== undefined && previousCents > cents && (
                <s className={styles.previous}>
                    <VisuallyHidden>{`${strings.format('price.previous')} `}</VisuallyHidden>
                    {money.format(previousCents / 100)}
                </s>
            )}
        </span>
    );
}
PriceTag.displayName = 'PriceTag';

export { PriceTag, priceTagVariants };
