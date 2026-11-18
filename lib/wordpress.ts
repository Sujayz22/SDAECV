const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://sdaecv.org/wp-json/wp/v2';

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{ name: string; avatar_urls?: { [key: string]: string } }>;
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

function sanitizeHtml(html: string): string {
  // Basic sanitization — strip dangerous script tags
  return html.replace(/<script[\s\S]*?<\/script>/gi, '');
}

export async function getPosts(params?: {
  page?: number;
  perPage?: number;
  categoryId?: number;
}): Promise<{ posts: WPPost[]; totalPages: number }> {
  const { page = 1, perPage = 9, categoryId } = params || {};

  const url = new URL(`${WP_API}/posts`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('_embed', '1');
  if (categoryId) url.searchParams.set('categories', String(categoryId));

  const res = await fetch(url.toString(), {
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    if (res.status === 404) return { posts: [], totalPages: 0 };
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }

  const totalPages = Number(res.headers.get('X-WP-TotalPages') || 1);
  const posts: WPPost[] = await res.json();
  return { posts, totalPages };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const url = new URL(`${WP_API}/posts`);
  url.searchParams.set('slug', slug);
  url.searchParams.set('_embed', '1');

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const posts: WPPost[] = await res.json();
  if (!posts.length) return null;

  const post = posts[0];
  post.content.rendered = sanitizeHtml(post.content.rendered);
  return post;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const url = new URL(`${WP_API}/posts`);
  url.searchParams.set('per_page', '100');
  url.searchParams.set('fields', 'slug');

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const posts: WPPost[] = await res.json();
  return posts.map((p) => p.slug);
}

export async function getCategories(): Promise<WPCategory[]> {
  const res = await fetch(`${WP_API}/categories?per_page=20`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getRelatedPosts(
  postId: number,
  categoryIds: number[],
): Promise<WPPost[]> {
  if (!categoryIds.length) return [];
  const url = new URL(`${WP_API}/posts`);
  url.searchParams.set('categories', categoryIds.join(','));
  url.searchParams.set('exclude', String(postId));
  url.searchParams.set('per_page', '3');
  url.searchParams.set('_embed', '1');

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

export function getPostFeaturedImage(post: WPPost): string | null {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
}

export function getPostAuthor(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? 'SDAECV Team';
}

export function getPostAuthorAvatar(post: WPPost): string | null {
  const avatars = post._embedded?.author?.[0]?.avatar_urls;
  if (!avatars) return null;
  return avatars['96'] || avatars['48'] || null;
}

export function getPostCategories(post: WPPost): string[] {
  return post._embedded?.['wp:term']?.[0]?.map((c) => c.name) ?? [];
}

export function getPostTags(post: WPPost): string[] {
  return post._embedded?.['wp:term']?.[1]?.map((t) => t.name) ?? [];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
