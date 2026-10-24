'use client';

import type { ToastProps as RACToastProps } from 'react-aria-components';
import clsx from 'clsx';
import { X } from 'lucide-react';
import {
    UNSTABLE_Toast as RACToast,
    UNSTABLE_ToastContent as RACToastContent,
    UNSTABLE_ToastRegion as RACToastRegion,
    Text,
    UNSTABLE_ToastQueue as ToastQueue,
} from 'react-aria-components';
import { flushSync } from 'react-dom';

import { Button } from '../Button/Button';
import styles from './Toast.module.scss';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition
    = | 'top-left'
        | 'top-center'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-center'
        | 'bottom-right';

export interface MyToastContent {
    title: string;
    description?: string;
    variant?: ToastVariant;
}

export const toastQueue = new ToastQueue<MyToastContent>({
    wrapUpdate(fn) {
        if ('startViewTransition' in document) {
            document.startViewTransition(() => {
                flushSync(fn);
            });
        }
        else {
            fn();
        }
    },
});

export type ToastRegionSlots = 'region';

export interface ToastRegionProps {
    position?: ToastPosition;
    classNames?: Partial<Record<ToastRegionSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ToastRegion({ ref, position = 'bottom-right', classNames }: ToastRegionProps) {
    return (
        <RACToastRegion
            ref={ref}
            queue={toastQueue}
            data-position={position}
            className={clsx(styles.toastRegion, classNames?.region)}
        >
            {({ toast }) => (
                <Toast toast={toast} variant={toast.content.variant}>
                    <RACToastContent className={styles.toastContent}>
                        <Text slot="title" className={styles.title}>
                            {toast.content.title}
                        </Text>
                        {toast.content.description && (
                            <Text slot="description" className={styles.description}>
                                {toast.content.description}
                            </Text>
                        )}
                    </RACToastContent>
                    <Button
                        slot="close"
                        aria-label="Close"
                        variant="ghost"
                        size="icon"
                        className={styles.closeButton}
                    >
                        <X size={16} aria-hidden />
                    </Button>
                </Toast>
            )}
        </RACToastRegion>
    );
}
ToastRegion.displayName = 'ToastRegion';

export type ToastSlots = 'toast' | 'content' | 'title' | 'description' | 'closeButton';

interface ToastProps extends RACToastProps<MyToastContent> {
    variant?: ToastVariant;
    classNames?: Partial<Record<ToastSlots, string>>;
}

function Toast({ className, classNames, variant, ...props }: ToastProps) {
    return (
        <RACToast
            {...props}
            data-variant={variant}
            style={{ viewTransitionName: props.toast.key } as React.CSSProperties}
            className={clsx(styles.toast, classNames?.toast, className)}
        />
    );
}
Toast.displayName = 'Toast';

export { Toast, ToastRegion };
