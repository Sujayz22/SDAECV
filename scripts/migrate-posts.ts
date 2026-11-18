import * as fs from 'fs';
import * as path from 'path';

// TypeScript interfaces for input posts.json
interface InputPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  shortDate: string;
  author: string;
  authorRole: string;
  authorImage: string;
  readTime: string;
  featured: boolean;
  image: string;
  tags: string[];
}

// Simple HTML to Portable Text parser
function parseHtmlToPortableText(html: string): any[] {
  const blocks: any[] = [];
  
  // Basic regex to find block tags (p, h2, blockquote, ol, ul, li)
  // We match <tag...>contents</tag>
  const blockRegex = /<(p|h2|blockquote|ol|ul)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  
  // Track lists
  let listType: 'number' | 'bullet' | undefined = undefined;

  // Helper to parse inline HTML tags like <strong>, <em>, etc.
  function parseInline(text: string): any[] {
    const spans: any[] = [];
    // We want to find tags like <strong>...</strong> or <em>...</em>
    // and extract plain text or styled spans.
    // A simple way is to tokenize by tags.
    const tokenRegex = /(<[^>]+>)/g;
    const tokens = text.split(tokenRegex);
    
    const activeMarks: string[] = [];
    
    for (const token of tokens) {
      if (token.startsWith('<') && token.endsWith('>')) {
        const tagName = token.replace(/[<>\/]/g, '').toLowerCase().trim().split(' ')[0];
        const isClosing = token.startsWith('</');
        
        if (tagName === 'strong' || tagName === 'b') {
          if (isClosing) {
            const idx = activeMarks.indexOf('strong');
            if (idx > -1) activeMarks.splice(idx, 1);
          } else {
            activeMarks.push('strong');
          }
        } else if (tagName === 'em' || tagName === 'i') {
          if (isClosing) {
            const idx = activeMarks.indexOf('em');
            if (idx > -1) activeMarks.splice(idx, 1);
          } else {
            activeMarks.push('em');
          }
        }
      } else {
        // Plain text
        if (token) {
          // Decode simple HTML entities
          const cleanText = token
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&ldquo;/g, '“')
            .replace(/&rdquo;/g, '”')
            .replace(/&lsquo;/g, '‘')
            .replace(/&rsquo;/g, '’')
            .replace(/&mdash;/g, '—')
            .replace(/&ndash;/g, '–');
            
          spans.push({
            _type: 'span',
            text: cleanText,
            marks: [...activeMarks],
          });
        }
      }
    }
    
    if (spans.length === 0) {
      spans.push({ _type: 'span', text: '', marks: [] });
    }
    return spans;
  }

  // Iterate over block matches
  const matches: { tag: string; attribs: string; content: string }[] = [];
  let lastIndex = 0;
  while ((match = blockRegex.exec(html)) !== null) {
    matches.push({
      tag: match[1].toLowerCase(),
      attribs: match[2],
      content: match[3],
    });
  }

  for (const m of matches) {
    const { tag, content } = m;
    
    if (tag === 'ol') {
      // Parse li items inside
      const liRegex = /<li>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(content)) !== null) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          listItem: 'number',
          children: parseInline(liMatch[1]),
        });
      }
    } else if (tag === 'ul') {
      const liRegex = /<li>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(content)) !== null) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          listItem: 'bullet',
          children: parseInline(liMatch[1]),
        });
      }
    } else {
      let style = 'normal';
      if (tag === 'h2') style = 'h2';
      if (tag === 'blockquote') style = 'blockquote';
      
      blocks.push({
        _type: 'block',
        style,
        children: parseInline(content),
      });
    }
  }

  return blocks;
}

function run() {
  const postsPath = path.join(__dirname, '../data/posts.json');
  if (!fs.existsSync(postsPath)) {
    console.error(`posts.json not found at ${postsPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(postsPath, 'utf8');
  const posts: InputPost[] = JSON.parse(rawData);

  // We will collect document mappings to make sure references match
  const categoriesMap = new Map<string, string>(); // name -> _id
  const authorsMap = new Map<string, string>(); // name -> _id

  const categoryDocs: any[] = [];
  const authorDocs: any[] = [];
  const postDocs: any[] = [];

  // Generate unique categories
  const categories = Array.from(new Set(posts.map(p => p.category)));
  categories.forEach((catName, index) => {
    const catId = `category-${catName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    categoriesMap.set(catName, catId);
    categoryDocs.push({
      _id: catId,
      _type: 'category',
      title: catName,
      slug: { _type: 'slug', current: catName.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      description: `Category for ${catName} articles.`,
    });
  });

  // Generate unique authors
  posts.forEach(p => {
    if (!p.author) return;
    const authorKey = p.author;
    if (!authorsMap.has(authorKey)) {
      const authorId = `author-${authorKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      authorsMap.set(authorKey, authorId);
      authorDocs.push({
        _id: authorId,
        _type: 'author',
        name: p.author,
        slug: { _type: 'slug', current: authorKey.toLowerCase().replace(/[^a-z0-9]/g, '-') },
        role: p.authorRole || 'Contributor',
        // Note: For profile image, we can't easily upload live images from url via simple JSON documents,
        // so we'll store the external image URL as a metadata field or fallback, or we can handle it later.
        // We'll also store the raw URL in an imageURL metadata field if needed.
        bio: [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: `${p.author} is a ${p.authorRole || 'contributor'} to SDAECV.`, marks: [] }],
          }
        ]
      });
    }
  });

  // Generate posts
  posts.forEach(p => {
    const postId = `post-${p.slug}`;
    const catId = categoriesMap.get(p.category);
    const authorId = authorsMap.get(p.author);

    // Parse date (e.g., "November 12, 2023") to ISO string
    let isoDate: string;
    try {
      isoDate = new Date(p.date).toISOString();
    } catch (e) {
      isoDate = new Date().toISOString();
    }

    const docContent: any = {
      _id: postId,
      _type: 'post',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      excerpt: p.excerpt,
      content: parseHtmlToPortableText(p.content),
      date: isoDate,
      readTime: p.readTime,
      featured: p.featured || false,
      tags: p.tags || [],
    };

    if (catId) {
      docContent.category = {
        _type: 'reference',
        _ref: catId,
      };
    }

    if (authorId) {
      docContent.author = {
        _type: 'reference',
        _ref: authorId,
      };
    }

    postDocs.push(docContent);
  });

  const output = {
    categories: categoryDocs,
    authors: authorDocs,
    posts: postDocs,
  };

  const outputPath = path.join(__dirname, '../data/sanity-migrated-payload.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Successfully generated migration payload with:
- ${categoryDocs.length} categories
- ${authorDocs.length} authors
- ${postDocs.length} posts
Saved to: ${outputPath}`);
}

run();
