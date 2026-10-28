'use client';

import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import {
    Award,
    Compass,
    Flame,
    Infinity as Forever,
    Gem,
    Globe,
    Lock,
    Moon,
    PartyPopper,
    PiggyBank,
    Repeat,
    Salad,
    Sparkles,
    Stamp,
    Sun,
    Ticket,
    Trophy,
    Utensils,
    Zap,
} from 'lucide-react';
import { useDateFormatter } from 'react-aria';

import { useStrings } from '../strings';
import styles from './BadgeMedal.module.scss';

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD';

export interface BadgeMedalProps {
    /** The badge's key (`night-owl`); picks the icon. */
    badgeKey: string;
    name: string;
    description: string;
    tier: BadgeTier | string;
    /** When it was earned (ISO); null while it is still to earn. */
    earnedAt?: string | null;
    headingLevel?: 3 | 4 | 5;
    className?: string;
}

const ICONS: [prefix: string, icon: LucideIcon][] = [
    ['first-nothing', Sparkles],
    ['regular', Repeat],
    ['nothing-addict', Forever],
    ['explorer', Compass],
    ['globetrotter', Globe],
    ['streak', Flame],
    ['night-owl', Moon],
    ['lunch-break', Sun],
    ['big-nothing', Gem],
    ['party', PartyPopper],
    ['saver', PiggyBank],
    ['calorie', Salad],
    ['stamp', Stamp],
    ['deal', Zap],
    ['coupon', Ticket],
    ['level', Trophy],
    ['golden-fork', Utensils],
];

const TIERS: Record<string, string | undefined> = { BRONZE: styles.bronze, SILVER: styles.silver, GOLD: styles.gold };

/** One badge: earned ones shine in their tier's colour, the others wait behind a lock. */
function BadgeMedal({ badgeKey, name, description, tier, earnedAt, headingLevel = 3, className }: BadgeMedalProps) {
    const strings = useStrings();
    const date = useDateFormatter({ dateStyle: 'medium' });
    const Heading = `h${headingLevel}` as const;
    const Icon = earnedAt
        ? (ICONS.find(([prefix]) => badgeKey.startsWith(prefix))?.[1] ?? Award)
        : Lock;
    return (
        <article className={clsx(styles.medal, TIERS[tier], !earnedAt && styles.locked, className)}>
            <span aria-hidden className={styles.disc}><Icon /></span>
            <div className={styles.text}>
                <Heading className={styles.name}>{name}</Heading>
                <p className={styles.description}>{description}</p>
                <p className={styles.meta}>
                    {`${strings.label('badge.tier', tier)} · `}
                    {earnedAt
                        ? strings.format('badge.earned', {
                                date: date.format(new Date(earnedAt)),
                            })
                        : strings.format('badge.locked')}
                </p>
            </div>
        </article>
    );
}
BadgeMedal.displayName = 'BadgeMedal';

export { BadgeMedal };
