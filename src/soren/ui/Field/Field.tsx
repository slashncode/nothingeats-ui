'use client';

import type {
    FieldErrorProps as RACFieldErrorProps,
    GroupProps as RACGroupProps,
    LabelProps as RACLabelProps,
    TextProps as RACTextProps,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    FieldError as RACFieldError,
    Group as RACGroup,
    Label as RACLabel,
    Text as RACText,
} from 'react-aria-components';

import styles from './Field.module.scss';

function Label(props: RACLabelProps) {
    return (
        <RACLabel
            {...props}
            className={clsx(styles.label, props.className)}
        />
    );
}
Label.displayName = 'Label';

function Description(props: RACTextProps) {
    return (
        <RACText
            {...props}
            slot="description"
            className={clsx(styles.description, props.className)}
        />
    );
}
Description.displayName = 'Description';

function FieldError(props: RACFieldErrorProps) {
    return (
        <RACFieldError
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.fieldError, className))}
        />
    );
}
FieldError.displayName = 'FieldError';

export interface FieldGroupProps extends RACGroupProps {
    variant?: 'default' | 'ghost';
    ref?: React.RefObject<HTMLDivElement | null>;
}

function FieldGroup({ ref, className, variant = 'default', ...props }: FieldGroupProps) {
    return (
        <RACGroup
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.group, styles[variant], className))}
        />
    );
}
FieldGroup.displayName = 'FieldGroup';

export { Description, FieldError, FieldGroup, Label };
