'use client';

import type {
    SwitchButtonProps as RACSwitchButtonProps,
    SwitchFieldProps as RACSwitchFieldProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    FieldError,
    SwitchButton as RACSwitchButton,
    SwitchField as RACSwitchField,
    Text,
} from 'react-aria-components';

import styles from './Switch.module.scss';

export type SwitchButtonSlots = 'track' | 'thumb' | 'label';

export interface SwitchButtonProps extends RACSwitchButtonProps {
    children?: React.ReactNode;
    classNames?: Partial<Record<SwitchButtonSlots, string>>;
    ref?: React.RefObject<HTMLLabelElement | null>;
}

// The clickable area of a switch — renders the track, thumb, and label.
function SwitchButton({ ref, children, className, classNames, ...props }: SwitchButtonProps) {
    return (
        <RACSwitchButton
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.switch, className))}
        >
            <div className={clsx(styles.track, classNames?.track)}>
                <div className={clsx(styles.thumb, classNames?.thumb)} />
            </div>
            {children && (
                <span className={classNames?.label}>{children}</span>
            )}
        </RACSwitchButton>
    );
}
SwitchButton.displayName = 'SwitchButton';

export interface SwitchFieldProps extends RACSwitchFieldProps {
    ref?: React.RefObject<HTMLDivElement | null>;
}

// The stateful container for a switch — owns selection/validation props and
// provides the description/error slots.
function SwitchField({ ref, className, ...props }: SwitchFieldProps) {
    return (
        <RACSwitchField
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.field, className))}
        />
    );
}
SwitchField.displayName = 'SwitchField';

export type SwitchSlots = 'field' | 'track' | 'thumb' | 'label' | 'description' | 'errorMessage';

export interface SwitchProps extends RACSwitchFieldProps {
    children?: React.ReactNode;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    classNames?: Partial<Record<SwitchSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

// Convenience switch: composes SwitchField + SwitchButton plus optional
// description / error message. Keeps the original `<Switch>Label</Switch>` API.
function Switch({ ref, children, className, classNames, description, errorMessage, ...props }: SwitchProps) {
    return (
        <SwitchField
            ref={ref}
            {...props}
            className={clsx(classNames?.field, className)}
        >
            <SwitchButton classNames={{ track: classNames?.track, thumb: classNames?.thumb, label: classNames?.label }}>
                {children}
            </SwitchButton>
            {description && (
                <Text
                    slot="description"
                    className={clsx(styles.description, classNames?.description)}
                >
                    {description}
                </Text>
            )}
            <FieldError className={clsx(styles.error, classNames?.errorMessage)}>
                {errorMessage}
            </FieldError>
        </SwitchField>
    );
}
Switch.displayName = 'Switch';

export { Switch, SwitchButton, SwitchField };
