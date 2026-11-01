'use client';

import type { VariantProps } from 'class-variance-authority';
import type { ImageSummary } from '../catalog';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

import styles from './Photo.module.scss';

const photoVariants = cva(styles.photo, {
    variants: {
        /** `card` for lists and thumbnails, `wide` for headers. */
        variant: {
            card: '',
            wide: '',
        },
    },
    defaultVariants: {
        variant: 'card',
    },
});

export interface PhotoProps extends VariantProps<typeof photoVariants> {
    ref?: React.RefObject<HTMLImageElement | null>;
    image: ImageSummary;
    /** Above the fold: load at once instead of lazily. */
    priority?: boolean;
    className?: string;
}

/**
 * An uploaded photo that fills its box: the editor's focal point stays in view however the box
 * crops it. Its alt text comes from the backoffice.
 */
function Photo({ ref, image, variant, priority = false, className }: PhotoProps) {
    return (
        <img
            ref={ref}
            src={variant === 'wide'
                ? image.wideUrl
                : image.cardUrl}
            alt={image.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={clsx(photoVariants({ variant }), className)}
            style={{ objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%` }}
        />
    );
}
Photo.displayName = 'Photo';

export { Photo, photoVariants };
