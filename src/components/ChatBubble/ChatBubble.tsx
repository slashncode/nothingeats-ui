'use client';

import clsx from 'clsx';

import { useStrings } from '../strings';
import styles from './ChatBubble.module.scss';

export interface ChatBubbleProps {
    /** Who speaks: the customer on the right, the Craving Coach on the left. */
    from: 'customer' | 'coach';
    /** The coach is still thinking: three dots instead of text. */
    pending?: boolean;
    children?: React.ReactNode;
    className?: string;
}

/**
 * One message in the Craving Coach chat. Screen readers hear who said it before what was said;
 * the surrounding list (`role="log"`) announces new messages.
 */
function ChatBubble({ from, pending = false, children, className }: ChatBubbleProps) {
    const strings = useStrings();
    return (
        <div className={clsx(styles.bubble, styles[from], pending && styles.pending, className)}>
            <span className={styles.author}>
                {strings.format(from === 'coach'
                    ? 'chat.coach'
                    : 'chat.you')}
            </span>
            {pending
                ? (
                        <span className={styles.dots} role="status">
                            <span className={styles.dot} />
                            <span className={styles.dot} />
                            <span className={styles.dot} />
                            <span className={styles.hidden}>{strings.format('chat.typing')}</span>
                        </span>
                    )
                : <div className={styles.text}>{children}</div>}
        </div>
    );
}
ChatBubble.displayName = 'ChatBubble';

export { ChatBubble };
