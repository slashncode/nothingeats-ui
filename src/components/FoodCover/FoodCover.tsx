'use client';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

import { cuisineLook } from '../catalog';
import styles from './FoodCover.module.scss';

const foodCoverVariants = cva(styles.cover, {
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

export interface FoodCoverProps extends VariantProps<typeof foodCoverVariants> {
    ref?: React.RefObject<HTMLDivElement | null>;
    /** Cuisine slug; picks the colour and the food. */
    cuisine: string;
    /** Overrides the cuisine's food. */
    emoji?: string;
    className?: string;
}

/**
 * The NothingEats picture for anything edible: a real plate with the ghost of the food on it.
 * Decorative only; the name next to it carries the meaning.
 */
function FoodCover({ ref, cuisine, emoji, size, className }: FoodCoverProps) {
    const look = cuisineLook(cuisine);
    return (
        <div
            ref={ref}
            aria-hidden
            data-cuisine={cuisine}
            className={clsx(foodCoverVariants({ size }), className)}
            style={{ '--ne-cover-hue': look.hue } as React.CSSProperties}
        >
            <span className={styles.plate}>
                <span className={styles.ghost}>{emoji ?? look.emoji}</span>
            </span>
        </div>
    );
}
FoodCover.displayName = 'FoodCover';

export { FoodCover, foodCoverVariants };
