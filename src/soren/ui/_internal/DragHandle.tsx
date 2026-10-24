'use client';

import type { ButtonProps as RACButtonProps } from 'react-aria-components';
import clsx from 'clsx';
import { GripVertical } from 'lucide-react';
import { Button as RACButton } from 'react-aria-components';

export interface DragHandleProps extends Omit<RACButtonProps, 'slot' | 'children'> {
    label?: string;
}

function DragHandle({ className, label = 'Drag to reorder', ...props }: DragHandleProps) {
    return (
        <RACButton
            slot="drag"
            aria-label={label}
            {...props}
            className={values =>
                clsx(typeof className === 'function' ? className(values) : className)}
        >
            <GripVertical size={16} />
        </RACButton>
    );
}
DragHandle.displayName = 'DragHandle';

export { DragHandle };
