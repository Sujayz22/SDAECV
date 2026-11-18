import { client } from './sanity/client';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: any; // Can be a Portable Text array (Sanity) or string HTML (fallback)
  category: string;
  date: string;
  shortDate: string;
  rawDate: string;
  author: string;
  authorRole: string;
  authorImage: string;
  readTime: string;
  featured: boolean;
  image: string;
  tags: string[];
}

export const CATEGORIES = [
  'All Articles',
  'Doctrine',
  'Community',
  'Youth',
  'Service',
  'Events',
  'Devotional',
  'Sermon Series',
];

const POST_FIELDS = `
  _id,
  "slug": slug.current,
  title,
  excerpt,
  content,
  "category": category->title,
  date,
  "author": author->name,
  "authorRole": author->role,
  "authorImage": author->image.asset->url,
  readTime,
  featured,
  "image": image.asset->url,
  tags
`;

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

function formatShortDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

function mapPost(p: any): BlogPost {
  if (!p) return {} as BlogPost;
  return {
    id: p._id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category || 'Doctrine',
    date: p.date ? formatDate(p.date) : '',
    shortDate: p.date ? formatShortDate(p.date) : '',
    rawDate: p.date || '',
    author: p.author || 'Author',
    authorRole: p.authorRole || 'Contributor',
    authorImage: p.authorImage || '',
    readTime: p.readTime || '5 min read',
    featured: p.featured || false,
    image: p.image || '',
    tags: p.tags || [],
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await client.fetch<any[]>(
    `*[_type == "post"] | order(date desc) { ${POST_FIELDS} }`
  );
  return posts.map(mapPost);
}

export async function getFeaturedPost(): Promise<BlogPost> {
  const posts = await client.fetch<any[]>(
    `*[_type == "post" && featured == true] | order(date desc) { ${POST_FIELDS} }`
  );
  if (posts.length > 0) return mapPost(posts[0]);
  
  // Fallback to latest post
  const latest = await client.fetch<any[]>(
    `*[_type == "post"] | order(date desc)[0...1] { ${POST_FIELDS} }`
  );
  return mapPost(latest[0]);
}

export async function getGridPosts(category?: string): Promise<BlogPost[]> {
  const posts = await client.fetch<any[]>(
    `*[_type == "post" && featured != true] | order(date desc) { ${POST_FIELDS} }`
  );
  const mapped = posts.map(mapPost);
  if (!category || category === 'All Articles') return mapped;
  return mapped.filter((p) => p.category === category);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await client.fetch<any>(
    `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS} }`,
    { slug }
  );
  return post ? mapPost(post) : undefined;
}

export async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
  const posts = await client.fetch<any[]>(
    `*[_type == "post" && slug.current != $currentSlug] | order(date desc)[0...$limit] { ${POST_FIELDS} }`,
    { currentSlug, limit }
  );
  return posts.map(mapPost);
}
