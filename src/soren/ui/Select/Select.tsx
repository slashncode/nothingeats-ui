'use client';

import type { SelectProps as RACSelectProps, ValidationResult } from 'react-aria-components';
import type { ButtonProps } from '../Button/Button';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import {
    composeRenderProps,
    Select as RACSelect,
    SelectValue as RACSelectValue,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import { Description, FieldError, Label } from '../Field/Field';
import { DropdownItem, DropdownListBox } from '../ListBox/ListBox';
import { Popover } from '../Popover/Popover';
import styles from './Select.module.scss';

export type SelectSlots
    = | 'label'
        | 'trigger'
        | 'value'
        | 'popover'
        | 'listBox'
        | 'description'
        | 'errorMessage';

export interface SelectProps<T extends object, M extends 'single' | 'multiple'>
    extends Omit<RACSelectProps<T, M>, 'children'> {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    items?: Iterable<T>;
    placeholder?: string;
    children: React.ReactNode | ((item: T) => React.ReactNode);
    buttonSize?: ButtonProps['size'];
    classNames?: Partial<Record<SelectSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Select<T extends object, M extends 'single' | 'multiple' = 'single'>({
    ref,
    label,
    description,
    errorMessage,
    children,
    items,
    className,
    classNames,
    placeholder,
    buttonSize,
    ...props
}: SelectProps<T, M>) {
    return (
        <RACSelect<T, M>
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.select, className))}
        >
            {label && <Label className={classNames?.label}>{label}</Label>}
            <Button
                size={buttonSize}
                variant="outline"
                className={clsx(styles.trigger, classNames?.trigger)}
            >
                <RACSelectValue className={clsx(styles.value, classNames?.value)}>
                    {({ selectedText, defaultChildren }) =>
                        selectedText || (placeholder || defaultChildren)}
                </RACSelectValue>
                <ChevronDown aria-hidden />
            </Button>
            {description && (
                <Description className={classNames?.description}>{description}</Description>
            )}
            <FieldError className={classNames?.errorMessage}>{errorMessage}</FieldError>
            <Popover className={clsx(styles.popover, classNames?.popover)}>
                <DropdownListBox items={items} className={classNames?.listBox}>
                    {children}
                </DropdownListBox>
            </Popover>
        </RACSelect>
    );
}
Select.displayName = 'Select';

const SelectItem = DropdownItem;
const SelectValue = RACSelectValue;

export { Select, SelectItem, SelectValue };
