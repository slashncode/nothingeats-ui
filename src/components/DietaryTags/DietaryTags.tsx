'use client';

import type { LucideIcon } from 'lucide-react';
import type { DietaryTag } from '../catalog';
import clsx from 'clsx';
import { BadgeCheck, Leaf, MilkOff, Sprout, WheatOff } from 'lucide-react';

import { DIETARY_TAGS } from '../catalog';
import { useStrings } from '../strings';
import styles from './DietaryTags.module.scss';

const ICONS: Record<DietaryTag, LucideIcon> = {
    vegan: Leaf,
    vegetarian: Sprout,
    gluten_free: WheatOff,
    lactose_free: MilkOff,
    halal: BadgeCheck,
};

export interface DietaryTagsProps {
    ref?: React.RefObject<HTMLUListElement | null>;
    /** Lowercase tags from the catalog API, e.g. `vegan`, `gluten_free`. */
    tags: string[];
    className?: string;
}

/** Static list of diet labels (not selectable, so a list rather than a TagGroup). */
function DietaryTags({ ref, tags, className }: DietaryTagsProps) {
    const strings = useStrings();
    if (tags.length === 0)
        return null;
    const ordered = [...tags].sort((a, b) => order(a) - order(b));
    return (
        <ul ref={ref} aria-label={strings.format('dietary.label')} className={clsx(styles.tags, className)}>
            {ordered.map((tag) => {
                const Icon = ICONS[tag as DietaryTag];
                return (
                    <li key={tag} data-tag={tag} className={clsx(styles.tag, tag === 'vegan' && styles.vegan)}>
                        {Icon && <Icon aria-hidden className={styles.icon} />}
                        {strings.label('dietary', tag)}
                    </li>
                );
            })}
        </ul>
    );
}
DietaryTags.displayName = 'DietaryTags';

function order(tag: string) {
    const index = DIETARY_TAGS.indexOf(tag as DietaryTag);
    return index === -1
        ? DIETARY_TAGS.length
        : index;
}

export { DietaryTags };
