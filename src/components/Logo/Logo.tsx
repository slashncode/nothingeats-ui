'use client';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

import styles from './Logo.module.scss';

const logoVariants = cva(styles.logo, {
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

export interface LogoProps extends VariantProps<typeof logoVariants> {
    ref?: React.RefObject<HTMLSpanElement | null>;
    /** Only the empty plate, e.g. for small headers; then the logo is labelled for screen readers. */
    markOnly?: boolean;
    className?: string;
}

/** An empty plate and the name. The brand in one sentence: order everything, eat nothing. */
function Logo({ ref, markOnly = false, size, className }: LogoProps) {
    return (
        <span
            ref={ref}
            role={markOnly ? 'img' : undefined}
            aria-label={markOnly ? 'NothingEats' : undefined}
            className={clsx(logoVariants({ size }), className)}
        >
            <svg viewBox="0 0 32 32" aria-hidden className={styles.mark}>
                <circle cx="16" cy="16" r="15" className={styles.plate} />
                <circle cx="16" cy="16" r="9" className={styles.rim} />
            </svg>
            {!markOnly && (
                <span className={styles.wordmark}>
                    <span className={styles.nothing}>Nothing</span>
                    Eats
                </span>
            )}
        </span>
    );
}
Logo.displayName = 'Logo';

export { Logo, logoVariants };
