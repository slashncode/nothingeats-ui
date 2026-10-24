'use client';

import type { FormProps as RACFormProps } from 'react-aria-components';
import clsx from 'clsx';
import { Form as RACForm } from 'react-aria-components';

import styles from './Form.module.scss';

export interface FormProps extends RACFormProps {
    ref?: React.RefObject<HTMLFormElement | null>;
}

function Form({ ref, className, ...props }: FormProps) {
    return (
        <RACForm
            ref={ref}
            {...props}
            className={clsx(styles.form, className)}
        />
    );
}
Form.displayName = 'Form';

export { Form };
