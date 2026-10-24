'use client';

import type { DishSummary } from '../catalog';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useNumberFormatter } from 'react-aria';

import { Button } from '../../soren/ui/Button/Button';
import { DietaryTags } from '../DietaryTags/DietaryTags';
import { PriceTag } from '../PriceTag/PriceTag';
import { SpiceLevel } from '../SpiceLevel/SpiceLevel';
import { useStrings } from '../strings';
import styles from './DishCard.module.scss';

export interface DishCardProps {
    ref?: React.RefObject<HTMLElement | null>;
    dish: DishSummary;
    /** Adds the dish to the cart; without it the add button is disabled. */
    onAdd?: (dish: DishSummary) => void;
    headingLevel?: 3 | 4 | 5;
    className?: string;
}

function DishCard({ ref, dish, onAdd, headingLevel = 3, className }: DishCardProps) {
    const strings = useStrings();
    const number = useNumberFormatter();
    const Heading = `h${headingLevel}` as const;
    return (
        <article
            ref={ref}
            data-ph-capture-attribute-dish-id={dish.id}
            className={clsx(styles.card, !dish.available && styles.unavailable, className)}
        >
            <div className={styles.body}>
                <Heading className={styles.name}>{dish.name}</Heading>
                <p className={styles.description}>{dish.description}</p>
                {(dish.dietary.length > 0 || dish.spiceLevel > 0) && (
                    <div className={styles.tags}>
                        <DietaryTags tags={dish.dietary} />
                        {dish.spiceLevel > 0 && <SpiceLevel level={dish.spiceLevel} />}
                    </div>
                )}
                <p className={styles.calories}>
                    {strings.format('dish.calories', {
                        calories: number.format(dish.calories),
                    })}
                </p>
                {dish.allergens.length > 0 && (
                    <p className={styles.allergens}>
                        {`${strings.format('dish.allergens')}: ${dish.allergens.map(allergen => strings.label('allergen', allergen)).join(', ')}`}
                    </p>
                )}
            </div>
            <div className={styles.aside}>
                <PriceTag cents={dish.priceCents} size="lg" />
                {dish.available
                    ? (
                            <Button
                                size="icon"
                                aria-label={strings.format('dish.add', { name: dish.name })}
                                isDisabled={!onAdd}
                                onPress={() => onAdd?.(dish)}
                            >
                                <Plus aria-hidden />
                            </Button>
                        )
                    : <span className={styles.soldOut}>{strings.format('dish.soldOut')}</span>}
            </div>
        </article>
    );
}
DishCard.displayName = 'DishCard';

export { DishCard };
