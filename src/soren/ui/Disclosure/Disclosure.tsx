'use client';

import type {
    DisclosureGroupProps as RACDisclosureGroupProps,
    DisclosurePanelProps as RACDisclosurePanelProps,
    DisclosureProps as RACDisclosureProps,
    HeadingProps as RACHeadingProps,
} from 'react-aria-components';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import {
    composeRenderProps,
    Disclosure as RACDisclosure,
    DisclosureGroup as RACDisclosureGroup,
    DisclosurePanel as RACDisclosurePanel,
    Heading as RACHeading,
} from 'react-aria-components';

import { Button } from '../Button/Button';
import styles from './Disclosure.module.scss';

export type DisclosureSlots = 'disclosure' | 'panel';

export interface DisclosureProps extends RACDisclosureProps {
    classNames?: Partial<Record<DisclosureSlots, string>>;
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Disclosure({ className, classNames, ref, ...props }: DisclosureProps) {
    return (
        <RACDisclosure
            ref={ref}
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.disclosure, classNames?.disclosure, className))}
        />
    );
}
Disclosure.displayName = 'Disclosure';

export type DisclosureHeaderSlots = 'header' | 'trigger' | 'chevron';

interface DisclosureHeaderProps extends RACHeadingProps {
    children: React.ReactNode;
    classNames?: Partial<Record<DisclosureHeaderSlots, string>>;
}

function DisclosureHeader({
    children,
    className,
    classNames,
    ...props
}: DisclosureHeaderProps) {
    return (
        <RACHeading {...props} className={clsx(classNames?.header, className)}>
            <Button
                slot="trigger"
                className={clsx(styles.trigger, classNames?.trigger)}
            >
                <ChevronRight aria-hidden className={clsx(styles.chevron, classNames?.chevron)} />
                <span>{children}</span>
            </Button>
        </RACHeading>
    );
}
DisclosureHeader.displayName = 'DisclosureHeader';

interface DisclosurePanelProps extends RACDisclosurePanelProps {
    contentClassName?: string;
}

function DisclosurePanel({
    className,
    contentClassName,
    ...props
}: DisclosurePanelProps) {
    return (
        <RACDisclosurePanel
            {...props}
            className={composeRenderProps(className, className =>
                clsx(styles.panel, className))}
        >
            <div className={clsx(styles.panelContent, contentClassName)}>
                {props.children}
            </div>
        </RACDisclosurePanel>
    );
}
DisclosurePanel.displayName = 'DisclosurePanel';

function DisclosureGroup(props: RACDisclosureGroupProps) {
    return (
        <RACDisclosureGroup
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.group, className))}
        />
    );
}
DisclosureGroup.displayName = 'DisclosureGroup';

export { Disclosure, DisclosureGroup, DisclosureHeader, DisclosurePanel };
