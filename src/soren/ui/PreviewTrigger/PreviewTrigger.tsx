'use client';

import type { PreviewTriggerProps as RACPreviewTriggerProps } from 'react-aria-components';
import type { PopoverProps } from '../Popover/Popover';

import clsx from 'clsx';
import {
    composeRenderProps,
    Focusable as RACFocusable,
    PreviewTrigger as RACPreviewTrigger,
} from 'react-aria-components';

import { Popover } from '../Popover/Popover';
import styles from './PreviewTrigger.module.scss';

export type PreviewTriggerProps = RACPreviewTriggerProps;

// RAC's PreviewTrigger renders no DOM of its own — it only provides context to a
// focusable trigger and a Popover. This thin wrapper exists so the bundled RAC name
// (a mangled id) shows as `PreviewTrigger` in the showcase's generated code and in
// React devtools, matching how Tooltip and Popover wrap their triggers. Defaults are
// restated so they show up in the component's own signature.
function PreviewTrigger({ delay = 600, closeDelay = 200, ...props }: PreviewTriggerProps) {
    return <RACPreviewTrigger delay={delay} closeDelay={closeDelay} {...props} />;
}
PreviewTrigger.displayName = 'PreviewTrigger';

export type PreviewPopoverSlots = 'popover' | 'arrow';

export type PreviewPopoverProps = PopoverProps;

// A Popover preset for previews: no arrow by default, a constrained width and card
// padding, so a link or profile preview reads as a card rather than a menu surface.
function PreviewPopover({ className, showArrow = false, ...props }: PreviewPopoverProps) {
    return (
        <Popover
            {...props}
            showArrow={showArrow}
            className={composeRenderProps(className, className =>
                clsx(styles.previewPopover, className))}
        />
    );
}
PreviewPopover.displayName = 'PreviewPopover';

// A PreviewTrigger's trigger must be focusable and must forward ref + props to a DOM
// element. Button and Link already do; wrap anything else (e.g. `<span role="link">`)
// in this. Re-exported so consumers don't need a second import from RAC.
const PreviewTriggerTarget = RACFocusable;
(PreviewTriggerTarget as { displayName?: string }).displayName = 'PreviewTriggerTarget';

export { PreviewPopover, PreviewTrigger, PreviewTriggerTarget };
