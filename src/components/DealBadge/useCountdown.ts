'use client';

import { useEffect, useState } from 'react';

/** Milliseconds until [endsAt] (ISO), updated every second; 0 once it has passed. */
export function useCountdown(endsAt: string, now: () => number = Date.now): number {
    const end = Date.parse(endsAt);
    const [remaining, setRemaining] = useState(() => Math.max(0, end - now()));
    useEffect(() => {
        setRemaining(Math.max(0, end - now()));
        const timer = setInterval(() => setRemaining(Math.max(0, end - now())), 1000);
        return () => clearInterval(timer);
    }, [end, now]);
    return remaining;
}

/** `12:34`, or `1:02:03` from an hour on. */
export function clock(ms: number): string {
    const total = Math.ceil(ms / 1000);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const mm = String(minutes).padStart(hours > 0
        ? 2
        : 1, '0');
    const ss = String(seconds).padStart(2, '0');
    return hours > 0
        ? `${hours}:${mm}:${ss}`
        : `${mm}:${ss}`;
}
