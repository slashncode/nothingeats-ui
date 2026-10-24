'use client';

import type {
    TabListProps as RACTabListProps,
    TabPanelProps as RACTabPanelProps,
    TabPanelsProps as RACTabPanelsProps,
    TabProps as RACTabProps,
    TabsProps as RACTabsProps,
} from 'react-aria-components';
import clsx from 'clsx';
import {
    composeRenderProps,
    SelectionIndicator as RACSelectionIndicator,
    Tab as RACTab,
    TabList as RACTabList,
    TabPanel as RACTabPanel,
    TabPanels as RACTabPanels,
    Tabs as RACTabs,
} from 'react-aria-components';

import styles from './Tabs.module.scss';

export interface TabsProps extends RACTabsProps {
    ref?: React.RefObject<HTMLDivElement | null>;
}

function Tabs({ ref, ...props }: TabsProps) {
    return (
        <RACTabs
            ref={ref}
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.tabs, className))}
        />
    );
}
Tabs.displayName = 'Tabs';

export type TabListSlots = 'list' | 'indicator';

export interface TabListProps<T extends object> extends RACTabListProps<T> {
    classNames?: Partial<Record<TabListSlots, string>>;
}

function TabList<T extends object>({ classNames, ...props }: TabListProps<T>) {
    return (
        <RACTabList
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.list, classNames?.list, className))}
        />
    );
}
TabList.displayName = 'TabList';

export interface TabProps extends RACTabProps {
    indicatorClassName?: string;
}

function Tab({ children, indicatorClassName, ...props }: TabProps) {
    return (
        <RACTab
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.tab, className))}
        >
            {composeRenderProps(children, children => (
                <>
                    {children}
                    <RACSelectionIndicator
                        className={clsx(styles.selectionIndicator, indicatorClassName)}
                    />
                </>
            ))}
        </RACTab>
    );
}
Tab.displayName = 'Tab';

function TabPanels<T extends object>(props: RACTabPanelsProps<T>) {
    return (
        <RACTabPanels
            {...props}
            className={clsx(styles.panels, props.className)}
        />
    );
}
TabPanels.displayName = 'TabPanels';

function TabPanel(props: RACTabPanelProps) {
    return (
        <RACTabPanel
            {...props}
            className={composeRenderProps(props.className, className =>
                clsx(styles.panel, className))}
        />
    );
}
TabPanel.displayName = 'TabPanel';

export { Tab, TabList, TabPanel, TabPanels, Tabs };
