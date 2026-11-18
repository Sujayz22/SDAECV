import Image from 'next/image';
import Link from 'next/link';
import {
  WPPost,
  getPostFeaturedImage,
  getPostAuthor,
  getPostAuthorAvatar,
  getPostCategories,
  formatDate,
  estimateReadTime,
} from '@/lib/wordpress';

interface BlogCardProps {
  post: WPPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const featuredImage = getPostFeaturedImage(post);
  const author = getPostAuthor(post);
  const authorAvatar = getPostAuthorAvatar(post);
  const categories = getPostCategories(post);
  const primaryCategory = categories[0] || 'Faith';
  const readTime = estimateReadTime(post.content.rendered);

  const title = post.title.rendered.replace(/&amp;/g, '&').replace(/&#8217;/g, "'");
  const excerpt = post.excerpt.rendered
    .replace(/<[^>]+>/g, '')
    .replace(/&hellip;/g, '…')
    .trim();

  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      {/* Featured Image */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-neutral-surface">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-denim/20 to-ming/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/40 text-[64px]">menu_book</span>
          </div>
        )}
        {/* Category badge overlay */}
        <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          {primaryCategory}
        </span>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/blog/${post.slug}`}>
          <h2
            className="font-display text-lg font-bold text-dark leading-snug mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </Link>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {excerpt}
        </p>

        {/* Footer: Author + Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={author}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">person</span>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-dark leading-none">{author}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(post.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {readTime} min read
          </div>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Read More
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}
