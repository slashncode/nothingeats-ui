'use client';

import type { GroupProps } from 'react-aria-components';
import clsx from 'clsx';
import * as React from 'react';
import { Group } from 'react-aria-components';

import styles from './ButtonGroup.module.scss';

export type ButtonGroupSlots = 'group';

export interface ButtonGroupProps extends GroupProps {
    orientation?: 'horizontal' | 'vertical';
    attached?: boolean;
    tabNavigation?: boolean;
    classNames?: Partial<Record<ButtonGroupSlots, string>>;
}

function ButtonGroup({
    orientation = 'horizontal',
    attached = false,
    tabNavigation = false,
    className,
    classNames,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
}: ButtonGroupProps) {
    const groupRef = React.useRef<HTMLDivElement>(null);
    const [focusedIndex, setFocusedIndex] = React.useState(0);

    React.useEffect(() => {
        if (!groupRef.current)
            return;

        const buttons = Array.from(groupRef.current.querySelectorAll('button'));
        if (!tabNavigation) {
            buttons.forEach((button, i) => {
                button.tabIndex = i === focusedIndex ? 0 : -1;
            });
        }
        else {
            buttons.forEach((button) => {
                button.removeAttribute('tabindex');
            });
        }
    }, [focusedIndex, tabNavigation, children]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'BUTTON')
            return;

        const buttons = Array.from(groupRef.current?.querySelectorAll('button') || []);
        const index = buttons.indexOf(target as HTMLButtonElement);

        let nextIndex = -1;
        if (orientation === 'horizontal') {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextIndex = index + 1;
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                nextIndex = index - 1;
            }
        }
        else {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                nextIndex = index + 1;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                nextIndex = index - 1;
            }
        }

        if (nextIndex >= 0 && nextIndex < buttons.length) {
            buttons[nextIndex].focus();
            if (!tabNavigation) {
                setFocusedIndex(nextIndex);
            }
        }
    };

    const handleFocus = (e: React.FocusEvent) => {
        if (!tabNavigation && e.target.tagName === 'BUTTON') {
            const buttons = Array.from(groupRef.current?.querySelectorAll('button') || []);
            const index = buttons.indexOf(e.target as HTMLButtonElement);
            if (index >= 0) {
                setFocusedIndex(index);
            }
        }
    };

    return (
        <Group
            {...props}
            ref={groupRef}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-orientation={orientation}
            data-attached={attached}
            className={clsx(styles.buttonGroup, classNames?.group, className)}
        >
            {children}
        </Group>
    );
}
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
