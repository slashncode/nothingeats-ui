'use client';

import type {
    ModalOverlayProps as RACModalOverlayProps,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    Modal as RACModal,
    ModalOverlay as RACModalOverlay,
} from 'react-aria-components';

import styles from './Modal.module.scss';

export type ModalSlots = 'overlay' | 'modal';

export interface ModalOverlayProps extends RACModalOverlayProps {
    clearBackdrop?: boolean;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ModalOverlay({ ref, className, clearBackdrop, ...props }: ModalOverlayProps) {
    return (
        <RACModalOverlay
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.overlay, className))}
            data-clear-backdrop={clearBackdrop}
        />
    );
}
ModalOverlay.displayName = 'ModalOverlay';

export interface ModalContentProps extends RACModalOverlayProps {
    side?: 'top' | 'bottom' | 'left' | 'right';
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ModalContent({ ref, className, side, ...props }: ModalContentProps) {
    return (
        <RACModal
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.modal, className))}
            data-side={side}
        />
    );
}
ModalContent.displayName = 'ModalContent';

export interface ModalProps extends RACModalOverlayProps {
    side?: 'top' | 'bottom' | 'left' | 'right';
    clearBackdrop?: boolean;
    classNames?: Partial<Record<ModalSlots, string>>;
}

function Modal({ side, clearBackdrop, classNames, className, children, ...props }: ModalProps) {
    return (
        <ModalOverlay
            {...props}
            clearBackdrop={clearBackdrop}
            className={classNames?.overlay}
        >
            <ModalContent side={side} className={clsx(classNames?.modal, className)}>
                {children}
            </ModalContent>
        </ModalOverlay>
    );
}
Modal.displayName = 'Modal';

export { Modal, ModalContent, ModalOverlay };
