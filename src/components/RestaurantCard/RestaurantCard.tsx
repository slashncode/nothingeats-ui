'use client';

import type { RestaurantSummary } from '../catalog';
import clsx from 'clsx';
import { Bike, Clock } from 'lucide-react';
import { useNumberFormatter } from 'react-aria';
import { Link } from 'react-aria-components';

import { FoodCover } from '../FoodCover/FoodCover';
import { OpenStatus } from '../OpenStatus/OpenStatus';
import { Rating } from '../Rating/Rating';
import { useStrings } from '../strings';
import styles from './RestaurantCard.module.scss';

export interface RestaurantCardProps {
    ref?: React.RefObject<HTMLElement | null>;
    restaurant: RestaurantSummary;
    /** Link to the restaurant's menu; routed client-side through RAC's RouterProvider. */
    href: string;
    headingLevel?: 2 | 3 | 4;
    className?: string;
}

/**
 * A restaurant in a list. The name is the only link; it stretches over the whole card, so the
 * card is clickable while assistive technology hears one link with a meaningful name.
 */
function RestaurantCard({ ref, restaurant, href, headingLevel = 3, className }: RestaurantCardProps) {
    const strings = useStrings();
    const money = useNumberFormatter({ style: 'currency', currency: 'EUR' });
    const Heading = `h${headingLevel}` as const;
    return (
        <article
            ref={ref}
            data-ph-capture-attribute-restaurant-slug={restaurant.slug}
            className={clsx(styles.card, !restaurant.openNow && styles.closed, className)}
        >
            <FoodCover cuisine={restaurant.cuisine} className={styles.cover} />
            <div className={styles.body}>
                <div className={styles.header}>
                    <Heading className={styles.name}>
                        <Link href={href} className={styles.link}>{restaurant.name}</Link>
                    </Heading>
                    <Rating value={restaurant.rating} />
                </div>
                <p className={styles.cuisine}>{strings.label('cuisine', restaurant.cuisine)}</p>
                <p className={styles.description}>{restaurant.description}</p>
                <ul className={styles.facts}>
                    <li>
                        <Clock aria-hidden className={styles.icon} />
                        {strings.format('delivery.minutes', { minutes: restaurant.deliveryMinutes })}
                    </li>
                    <li>
                        <Bike aria-hidden className={styles.icon} />
                        {restaurant.deliveryFeeCents === 0
                            ? strings.format('delivery.free')
                            : strings.format('delivery.fee', {
                                    fee: money.format(restaurant.deliveryFeeCents / 100),
                                })}
                    </li>
                </ul>
                <OpenStatus open={restaurant.openNow} opensAt={restaurant.opensAt} />
            </div>
        </article>
    );
}
RestaurantCard.displayName = 'RestaurantCard';

export { RestaurantCard };
