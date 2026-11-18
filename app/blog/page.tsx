import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getFeaturedPost, getGridPosts } from '@/lib/blog-data';
import NewsletterForm from '@/components/NewsletterForm';
import BlogClient from './BlogClient';

export const revalidate = 120;

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const activeCategory = params.category || 'All Articles';

  const featured = await getFeaturedPost();
  const gridPosts = await getGridPosts();

  return (
    <>
      <Navbar dark={false} />

      <div className="relative z-10 flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fcfcfc] text-[#1a1c1b]" style={{ fontFamily: 'var(--font-newsreader), serif' }}>
        <main className="flex-1 flex flex-col items-center w-full pt-24">
          <div className="w-full max-w-[1440px] px-6 md:px-12 lg:px-20 py-12 md:py-24 flex flex-col gap-16 md:gap-24">

            {/* Journal Header */}
            <div className="flex flex-col gap-8 items-start max-w-4xl">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-[#ffb800]"></div>
                <span className="text-[#004d40] font-sans text-xs font-black uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>The Journal</span>
              </div>
              <h1 className="text-[#1a1c1b] text-6xl md:text-8xl lg:text-9xl font-medium tracking-[-0.04em] leading-[0.85]">
                Living <span className="italic text-gray-400 font-light">Faith</span>.
              </h1>
              <p className="text-gray-600 text-xl md:text-2xl max-w-2xl font-light leading-relaxed" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                Reflections on scripture, community news, and spiritual insights from the Seventh-day Adventist English Church in Vellore.
              </p>
            </div>

            {/* Featured Hero Post */}
            <Link href={`/blog/${featured.slug}`} className="w-full group cursor-pointer">
              <div className="relative w-full h-[600px] md:h-[750px] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-1000 ring-1 ring-black/5">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${featured.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004d40]/95 via-[#004d40]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 p-8 md:p-16 lg:p-20 w-full max-w-5xl flex flex-col gap-6 md:gap-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center rounded-full bg-[#ffb800] px-5 py-2 text-xs font-black text-[#004d40] uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                      {featured.category}
                    </span>
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{featured.date}</span>
                  </div>
                  <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.9] tracking-tight group-hover:text-[#ffb800] transition-colors duration-500">
                    {featured.title}
                  </h2>
                  <p className="text-gray-200 text-xl md:text-2xl font-light line-clamp-2 leading-relaxed max-w-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 hidden md:block" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-white text-sm mt-4" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    <div className="flex items-center gap-3">
                      {featured.authorImage ? (
                        <div
                          className="w-10 h-10 rounded-full border-2 border-[#ffb800]/50 bg-gray-200 bg-cover bg-center"
                          style={{ backgroundImage: `url(${featured.authorImage})` }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-[#ffb800]/50 bg-[#004d40]/50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[18px]">person</span>
                        </div>
                      )}
                      <span className="font-bold tracking-wide">{featured.author}</span>
                    </div>
                    <span className="text-[#ffb800]">•</span>
                    <span className="opacity-90 font-medium">{featured.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Articles Section */}
            <BlogClient initialCategory={activeCategory} featured={featured} posts={gridPosts} />

            {/* Newsletter CTA */}
            <div className="w-full mt-12 mb-8">
              <div className="rounded-[3rem] bg-[#004d40] p-12 md:p-24 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-[#ffb800]/20 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-[#ffb800]/10 rounded-full blur-[120px] opacity-40" />
                <div className="relative z-10 flex flex-col items-center gap-10 max-w-3xl mx-auto">
                  <div className="p-5 bg-white/5 rounded-full w-fit backdrop-blur-md ring-1 ring-white/20">
                    <span className="material-symbols-outlined text-[#ffb800] text-4xl">local_post_office</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-white text-5xl md:text-6xl font-medium leading-tight tracking-tight">Stay Connected.</h2>
                    <p className="text-gray-300 text-xl font-light leading-relaxed" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                      Receive weekly devotionals, Sabbath bulletins, and community updates from SDAECV directly in your inbox.
                    </p>
                  </div>
                  <NewsletterForm variant="page" />
                  <p className="text-white/40 text-xs mt-4 uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Respecting your privacy. No spam.</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
