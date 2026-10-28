'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { useStrings } from '../strings';
import styles from './SpinWheel.module.scss';

/** The wheel's segments in the loyalty service's prize keys, in the order they are drawn. */
export const WHEEL_PRIZES = [
    'PERCENT_10',
    'FREE_DELIVERY',
    'AMOUNT_5',
    'BONUS_XP',
    'PERCENT_20',
    'FREE_DISH',
    'GOLDEN_FORK',
] as const;

export interface SpinWheelProps {
    /** Prize keys clockwise from the top; labels come from the strings (`wheel.<KEY>`). */
    prizes?: readonly string[];
    /**
     * The prize the wheel stops at: the server decided it, the wheel only shows it. Each new value
     * spins a few turns and lands there; null keeps it still.
     */
    result: string | null;
    /** A new spin with the same result (e.g. twice "10 %") needs a new id. */
    spinId?: number;
    /** When the wheel has stopped (at once for people who prefer reduced motion). */
    onSpinEnd?: () => void;
    className?: string;
}

const TURNS = 5;
const COLORS = [
    'var(--ne-deal)',
    'var(--secondary)',
    'var(--accent)',
    'var(--ne-gold)',
];
const INK = [
    'var(--ne-deal-foreground)',
    'var(--secondary-foreground)',
    'var(--accent-foreground)',
    'var(--foreground)',
];

function wedge(index: number, count: number): string {
    const step = (2 * Math.PI) / count;
    const from = index * step - Math.PI / 2;
    const to = from + step;
    const point = (angle: number) => `${(100 * Math.cos(angle)).toFixed(3)} ${(100 * Math.sin(angle)).toFixed(3)}`;
    return `M 0 0 L ${point(from)} A 100 100 0 0 1 ${point(to)} Z`;
}

/** Along the radius; on the lower half turned around, so no label stands on its head. */
function labelTransform(angle: number): string {
    const turn = angle > 90 && angle < 270
        ? -90
        : 90;
    return `rotate(${angle}) translate(0 -62) rotate(${turn})`;
}

/**
 * The wheel of fortune, decorative: the result is decided on the server and passed in. The app
 * announces it in words; for assistive technology the wheel is one labelled image.
 */
function SpinWheel({ prizes = WHEEL_PRIZES, result, spinId = 0, onSpinEnd, className }: SpinWheelProps) {
    const strings = useStrings();
    const [rotation, setRotation] = useState(0);
    const ended = useRef(onSpinEnd);
    ended.current = onSpinEnd;
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const count = prizes.length;
    const step = 360 / count;

    useEffect(() => {
        if (result === null)
            return;
        const index = prizes.indexOf(result);
        if (index < 0)
            return;
        // Bring the segment's middle under the pointer at the top, a few full turns further on.
        setRotation((current) => {
            const target = (360 - (index + 0.5) * step) % 360;
            const base = current - (current % 360) + TURNS * 360;
            return base + target;
        });
        if (reducedMotion)
            ended.current?.();
    }, [
        result,
        spinId,
        prizes,
        step,
        reducedMotion,
    ]);

    return (
        <div className={clsx(styles.wheel, className)}>
            <svg viewBox="-104 -112 208 216" role="img" aria-label={strings.format('wheel.label')} className={styles.svg}>
                <g
                    className={styles.disc}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    onTransitionEnd={() => ended.current?.()}
                >
                    {prizes.map((prize, index) => (
                        <g key={prize}>
                            <path d={wedge(index, count)} fill={COLORS[index % COLORS.length]} stroke="var(--card)" strokeWidth="1.5" />
                            <text
                                transform={labelTransform((index + 0.5) * step)}
                                fill={INK[index % INK.length]}
                                className={styles.label}
                                textAnchor="middle"
                                dominantBaseline="central"
                            >
                                {strings.label('wheel', prize)}
                            </text>
                        </g>
                    ))}
                    <circle r="14" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
                </g>
                <path d="M -9 -110 L 9 -110 L 0 -92 Z" fill="var(--foreground)" className={styles.pointer} />
            </svg>
        </div>
    );
}
SpinWheel.displayName = 'SpinWheel';

export { SpinWheel };
