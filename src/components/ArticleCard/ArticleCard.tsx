'use client';

import type { ArticleSummary } from '../catalog';
import clsx from 'clsx';
import { useDateFormatter } from 'react-aria';
import { Link } from 'react-aria-components';

import { FoodCover } from '../FoodCover/FoodCover';
import { Photo } from '../Photo/Photo';
import { useStrings } from '../strings';
import styles from './ArticleCard.module.scss';

export interface ArticleCardProps {
    ref?: React.RefObject<HTMLElement | null>;
    article: ArticleSummary;
    /** Link to the article; routed client-side through RAC's RouterProvider. */
    href: string;
    headingLevel?: 2 | 3 | 4;
    className?: string;
}

/**
 * An article of the blog in a list. Like RestaurantCard, the title is the only link and
 * stretches over the card; without a cover the card draws a plate of nothing.
 */
function ArticleCard({ ref, article, href, headingLevel = 3, className }: ArticleCardProps) {
    const strings = useStrings();
    const date = useDateFormatter({ dateStyle: 'long' });
    const Heading = `h${headingLevel}` as const;
    return (
        <article ref={ref} data-ph-capture-attribute-article-slug={article.slug} className={clsx(styles.card, className)}>
            {article.cover
                ? <Photo image={article.cover} className={styles.cover} />
                : <FoodCover cuisine="desserts" emoji="📰" className={styles.cover} />}
            <div className={styles.body}>
                {article.category && <p className={styles.category}>{article.category.name}</p>}
                <Heading className={styles.title}>
                    <Link href={href} className={styles.link}>{article.title}</Link>
                </Heading>
                <p className={styles.excerpt}>{article.excerpt}</p>
                {article.publishedAt && (
                    <p className={styles.date}>
                        {strings.format('article.published', {
                            date: date.format(new Date(article.publishedAt)),
                        })}
                    </p>
                )}
            </div>
        </article>
    );
}
ArticleCard.displayName = 'ArticleCard';

export { ArticleCard };
