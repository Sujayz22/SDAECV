import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/blog-data';
import { PortableText } from 'next-sanity';
import NewsletterForm from '@/components/NewsletterForm';

export const revalidate = 300;
export const dynamicParams = true;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | The Journal — SDAECV`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, 3);

  return (
    <>
      <Navbar dark={false} />

      <div
        className="relative z-10 flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fcfcfb] text-[#1a1c1c] antialiased"
        style={{ fontFamily: 'var(--font-newsreader), serif' }}
      >
        <main className="flex-1 flex flex-col items-center w-full">

          {/* ── Back to Journal ─────────────────────────────── */}
          <div className="w-full max-w-[1280px] px-4 md:px-8 lg:px-12 pt-32 pb-4 animate-fade-in-up">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-gray-500 hover:text-[#004b49] transition-colors duration-200 text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform duration-200">
                arrow_back
              </span>
              Back to Journal
            </Link>
          </div>

          {/* ── Article Header ──────────────────────────────── */}
          <div
            className="w-full max-w-4xl px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-6 md:gap-8 items-center text-center mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            {/* Category + Date badge row */}
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full border border-[#004b49]/20 bg-[#004b49]/5 text-[#004b49] text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {post.category}
              </span>
              <span
                className="text-gray-400 text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {post.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[#1a1c1c] text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05]">
              {post.title}
            </h1>

            {/* Subtitle / Excerpt */}
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl italic">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="flex items-center gap-4 mt-2">
              {post.authorImage ? (
                <div
                  className="w-12 h-12 rounded-full border border-gray-100 bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.authorImage})` }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full border border-gray-100 bg-[#004b49]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#004b49] text-[22px]">person</span>
                </div>
              )}
              <div className="flex flex-col items-start text-left">
                <span
                  className="text-sm font-bold text-[#004b49] uppercase tracking-tight"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {post.author}
                </span>
                <span
                  className="text-[11px] text-gray-500 uppercase tracking-wider font-medium"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {post.authorRole} · {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* ── Hero Image ──────────────────────────────────── */}
          <div
            className="w-full max-w-[1400px] px-4 md:px-8 lg:px-12 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004b49]/20 to-transparent" />
            </div>
            <div className="text-center mt-4">
              <p
                className="text-[10px] text-gray-400 uppercase tracking-widest font-medium"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Media Team · SDAEC Vellore
              </p>
            </div>
          </div>

          {/* ── Article Body (12-col grid) ───────────────────── */}
          <div
            className="w-full max-w-[1280px] px-4 md:px-8 lg:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 relative animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Share sidebar (desktop left) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-end pt-2">
              <div className="sticky top-32 flex flex-col gap-4">
                <p
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right mb-2"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Share
                </p>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="w-10 h-10 rounded-full bg-white border border-gray-100 hover:border-[#f2b824] hover:text-[#f2b824] text-[#004b49] transition-all flex items-center justify-center shadow-sm"
                >
                  <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>X</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="w-10 h-10 rounded-full bg-white border border-gray-100 hover:border-[#f2b824] hover:text-[#f2b824] text-[#004b49] transition-all flex items-center justify-center shadow-sm"
                >
                  <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>f</span>
                </a>
                <button
                  aria-label="Copy Link"
                  className="w-10 h-10 rounded-full bg-white border border-gray-100 hover:border-[#f2b824] hover:text-[#f2b824] text-[#004b49] transition-all flex items-center justify-center shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
              </div>
            </div>

            {/* Article content */}
            <article className="col-span-1 lg:col-span-8 lg:px-4">
              <div className="blog-prose text-gray-800 leading-loose">
                {Array.isArray(post.content) ? (
                  <PortableText value={post.content} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>

              {/* Tags + mobile share */}
              <div
                className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-[11px] font-bold uppercase tracking-widest hover:bg-[#004b49] hover:text-white transition-all border border-transparent hover:border-[#004b49] cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex lg:hidden gap-2">
                  <button className="w-10 h-10 rounded-full bg-white border border-gray-100 text-[#004b49] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Right spacer (desktop) */}
            <div className="hidden lg:block lg:col-span-2" />
          </div>

          {/* ── More from the Journal ──────────────────────── */}
          {related.length > 0 && (
            <div className="w-full bg-[#f8f9f8] py-20 border-t border-gray-100">
              <div className="w-full max-w-[1280px] px-4 md:px-8 lg:px-12 mx-auto flex flex-col gap-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-3xl font-medium text-[#004b49] tracking-tight">
                    More from the Journal
                  </h3>
                  <Link
                    href="/blog"
                    className="text-[#004b49] text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    View All{' '}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="flex flex-col gap-5 group cursor-pointer"
                    >
                      <div className="overflow-hidden rounded-2xl aspect-[4/3] w-full bg-gray-100 relative shadow-md ring-1 ring-black/5">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${rel.image})` }}
                        />
                        <div className="absolute inset-0 bg-[#004b49]/0 group-hover:bg-[#004b49]/20 transition-colors duration-500" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className="text-[#f2b824] text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#f2b824]/10 w-fit"
                          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          {rel.category}
                        </span>
                        <h4 className="text-[#004b49] text-xl font-medium leading-[1.2] group-hover:text-[#f2b824] transition-colors duration-300">
                          {rel.title}
                        </h4>
                        <p
                          className="text-gray-500 text-sm line-clamp-2"
                          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          {rel.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Stay Connected CTA ────────────────────────── */}
          <div className="w-full max-w-[1280px] px-4 md:px-8 lg:px-12 py-12 md:py-20">
            <div className="rounded-3xl bg-[#004b49] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
              {/* Ambient glows */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#f2b824]/20 rounded-full blur-[100px] opacity-40" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#f2b824]/10 rounded-full blur-[100px] opacity-40" />

              <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
                <div className="p-4 bg-white/10 rounded-full w-fit backdrop-blur-md ring-1 ring-white/20">
                  <span className="material-symbols-outlined text-[#f2b824] text-3xl">mail</span>
                </div>
                <h2 className="text-white text-4xl md:text-5xl font-medium leading-tight tracking-tight">
                  Stay Connected.
                </h2>
                <p
                  className="text-gray-300 text-lg font-light leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Get the latest devotionals, church news, and sermon notes delivered directly to your inbox every Friday morning.
                </p>
                <NewsletterForm variant="post" />
                <p
                  className="text-gray-400 text-[10px] uppercase tracking-widest mt-2"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  SDAECV Newsletter · Respecting your privacy
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </>
  );
}
