'use client';

import clsx from 'clsx';
import { Check, Copy, Ticket } from 'lucide-react';
import { useState } from 'react';
import { useDateFormatter, useNumberFormatter } from 'react-aria';

import { Button } from '../../soren/ui/Button/Button';
import { useStrings } from '../strings';
import styles from './CouponCard.module.scss';

export type CouponKind = 'PERCENT' | 'AMOUNT' | 'FREE_DELIVERY' | 'FREE_DISH';

export interface CouponSummary {
    code: string;
    kind: CouponKind | string;
    /** Percent for PERCENT, cents for AMOUNT, 0 otherwise. */
    value: number;
    maxDiscountCents?: number | null;
    minimumOrderCents?: number;
    restaurant?: { slug: string; name: string } | null;
    expiresAt?: string;
}

/** What a coupon gives, in the current locale: "10 % Rabatt (bis 10,00 €)", "Ein Gericht gratis". */
export function useCouponText() {
    const strings = useStrings();
    const money = useNumberFormatter({ style: 'currency', currency: 'EUR' });
    const euros = (cents: number) => money.format(cents / 100);
    return {
        title: (coupon: Pick<CouponSummary, 'kind' | 'value' | 'maxDiscountCents'>) => {
            const base = strings.format(`coupon.${coupon.kind}`, {
                value: coupon.value,
                amount: euros(coupon.value),
            });
            return coupon.maxDiscountCents
                ? `${base} (${strings.format('coupon.max', {
                    amount: euros(coupon.maxDiscountCents),
                })})`
                : base;
        },
        conditions: (coupon: CouponSummary) =>
            [
                coupon.restaurant && strings.format('coupon.only', { restaurant: coupon.restaurant.name }),
                coupon.minimumOrderCents
                    ? strings.format('coupon.minimum', {
                            amount: euros(coupon.minimumOrderCents),
                        })
                    : null,
            ].filter(Boolean).join(' · '),
    };
}

export interface CouponCardProps {
    coupon: CouponSummary;
    /** An action next to the code, e.g. "apply to cart"; without it the code can be copied. */
    action?: React.ReactNode;
    headingLevel?: 3 | 4 | 5;
    className?: string;
}

/** A coupon with its code, what it gives, where and until when. */
function CouponCard({ coupon, action, headingLevel = 3, className }: CouponCardProps) {
    const strings = useStrings();
    const text = useCouponText();
    const date = useDateFormatter({ dateStyle: 'medium' });
    const [copied, setCopied] = useState(false);
    const Heading = `h${headingLevel}` as const;
    const conditions = text.conditions(coupon);
    return (
        <article className={clsx(styles.coupon, className)}>
            <Ticket aria-hidden className={styles.icon} />
            <div className={styles.body}>
                <Heading className={styles.title}>{text.title(coupon)}</Heading>
                {conditions && <p className={styles.meta}>{conditions}</p>}
                {coupon.expiresAt && (
                    <p className={styles.meta}>
                        {strings.format('coupon.expires', {
                            date: date.format(new Date(coupon.expiresAt)),
                        })}
                    </p>
                )}
            </div>
            <div className={styles.side}>
                <code className={styles.code}>{coupon.code}</code>
                {action ?? (
                    <Button
                        size="icon"
                        variant="ghost"
                        aria-label={copied
                            ? strings.format('coupon.copied')
                            : strings.format('coupon.copy', { code: coupon.code })}
                        onPress={() => {
                            void navigator.clipboard?.writeText(coupon.code).then(() => setCopied(true));
                        }}
                    >
                        {copied
                            ? <Check aria-hidden />
                            : <Copy aria-hidden />}
                    </Button>
                )}
            </div>
        </article>
    );
}
CouponCard.displayName = 'CouponCard';

export { CouponCard };
