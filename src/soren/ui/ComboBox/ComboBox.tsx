'use client';

import type {
    ComboBoxProps as RACComboBoxProps,
    ValidationResult,
} from 'react-aria-components';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { composeRenderProps, ComboBox as RACComboBox } from 'react-aria-components';

import { Button } from '../Button/Button';
import { Description, FieldError, FieldGroup, Label } from '../Field/Field';
import { DropdownItem, DropdownListBox } from '../ListBox/ListBox';
import { Popover } from '../Popover/Popover';
import { Input } from '../TextField/TextField';
import styles from './ComboBox.module.scss';

export type ComboBoxSlots
    = | 'label'
        | 'fieldGroup'
        | 'input'
        | 'prefix'
        | 'suffix'
        | 'trigger'
        | 'popover'
        | 'listBox'
        | 'description'
        | 'errorMessage';

export interface ComboBoxProps<T extends object>
    extends Omit<RACComboBoxProps<T>, 'children'> {
    label?: string;
    description?: string | null;
    errorMessage?: string | ((validation: ValidationResult) => string);
    placeholder?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    children: React.ReactNode | ((item: T) => React.ReactNode);
    classNames?: Partial<Record<ComboBoxSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function ComboBox<T extends object>({
    ref,
    label,
    description,
    errorMessage,
    children,
    items,
    className,
    classNames,
    placeholder,
    prefix,
    suffix,
    ...props
}: ComboBoxProps<T>) {
    return (
        <RACComboBox
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.comboBox, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <FieldGroup className={clsx(styles.fieldGroup, classNames?.fieldGroup)}>
                {prefix != null && prefix !== '' && (
                    <span className={clsx(styles.affix, classNames?.prefix)}>{prefix}</span>
                )}
                <Input
                    className={clsx(styles.input, classNames?.input)}
                    placeholder={placeholder}
                />
                {suffix != null && suffix !== '' && (
                    <span className={clsx(styles.affix, classNames?.suffix)}>{suffix}</span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle options"
                    className={clsx(styles.trigger, classNames?.trigger)}
                >
                    <ChevronDown aria-hidden />
                </Button>
            </FieldGroup>
            {description && (
                <Description className={classNames?.description}>{description}</Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
            <Popover className={clsx(styles.popover, classNames?.popover)}>
                <DropdownListBox items={items} className={clsx(styles.listBox, classNames?.listBox)}>
                    {children}
                </DropdownListBox>
            </Popover>
        </RACComboBox>
    );
}
ComboBox.displayName = 'ComboBox';

const ComboBoxItem = DropdownItem;

export { ComboBox, ComboBoxItem };
