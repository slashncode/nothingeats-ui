'use client';

import type { DialogProps as RACDialogProps } from 'react-aria-components';
import clsx from 'clsx';
import { Dialog as RACDialog, DialogTrigger as RACDialogTrigger } from 'react-aria-components';

import styles from './Dialog.module.scss';

function Dialog(props: RACDialogProps) {
    return (
        <RACDialog
            {...props}
            className={clsx(styles.dialog, props.className)}
        />
    );
}
Dialog.displayName = 'Dialog';

// Thin wrapper so the bundled RAC name (a mangled id) shows as `DialogTrigger`
// in the showcase's generated code and React devtools.
function DialogTrigger(props: React.ComponentProps<typeof RACDialogTrigger>) {
    return <RACDialogTrigger {...props} />;
}
DialogTrigger.displayName = 'DialogTrigger';

export { Dialog, DialogTrigger };
