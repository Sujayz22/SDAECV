'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost, CATEGORIES } from '@/lib/blog-data';

interface BlogClientProps {
  initialCategory: string;
  featured: BlogPost;
  posts: BlogPost[];
}

type SortOption = 'latest' | 'oldest' | 'title' | 'readTime';

const SORT_LABELS: Record<SortOption, string> = {
  latest: 'Latest',
  oldest: 'Oldest',
  title: 'Alphabetical (A - Z)',
  readTime: 'Quick Reads First',
};

export default function BlogClient({ initialCategory, featured, posts }: BlogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query parameter initially
  const urlCategory = searchParams.get('category') || 'All Articles';

  // State
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll shadows state
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  // Check scroll position to toggle shadows
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    // Show left shadow if we have scrolled right at all
    setShowLeftShadow(scrollLeft > 4);

    // Show right shadow if there is still content to scroll on the right
    const maxScroll = el.scrollWidth - el.clientWidth;
    setShowRightShadow(scrollLeft < maxScroll - 4);
  };

  // Attach scroll listeners
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    // Run initial check
    checkScroll();

    // Recheck on window resize
    window.addEventListener('resize', checkScroll);

    // Recheck after DOM updates
    const timeoutId = setTimeout(checkScroll, 100);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timeoutId);
    };
  }, [activeCategory]);

  // Center active category on change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const activeEl = el.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEl) {
      const containerWidth = el.clientWidth;
      const activeWidth = activeEl.clientWidth;
      const activeLeft = activeEl.offsetLeft;

      // Scroll to position such that active element is centered
      el.scrollTo({
        left: activeLeft - containerWidth / 2 + activeWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);


  // Sync state with URL category parameter
  useEffect(() => {
    setActiveCategory(urlCategory);
    // Reset page pagination on category change
    setVisibleCount(6);
  }, [urlCategory]);

  // Sync state changes back to URL query parameter
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(6);

    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All Articles') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedPosts = useMemo(() => {
    // 1. Filter
    let result = posts.filter((post) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'All Articles' || post.category === activeCategory;

      // Search query filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false);

      return matchesCategory && matchesSearch;
    });

    // 2. Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
        case 'oldest':
          return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime': {
          const aTime = parseInt(a.readTime) || 0;
          const bTime = parseInt(b.readTime) || 0;
          return aTime - bTime;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [posts, activeCategory, searchQuery, sortBy]);

  // Paginated posts
  const visiblePosts = useMemo(() => {
    return filteredAndSortedPosts.slice(0, visibleCount);
  }, [filteredAndSortedPosts, visibleCount]);

  const hasMore = filteredAndSortedPosts.length > visibleCount;

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    handleCategoryChange('All Articles');
    setSortBy('latest');
  };

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Search and Filters Bar */}
      <div className="sticky top-[80px] z-40 bg-[#fcfcfc]/95 border-b border-gray-100 py-4 backdrop-blur-md flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">

        {/* Category Pills Selector Wrapper */}
        <div className="relative flex-1 min-w-0 max-w-full">
          {/* Left Gradient Fade overlay */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fcfcfc] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showLeftShadow ? 'opacity-100' : 'opacity-0'
              }`}
          />

          {/* Scrollable list wrapper */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-2 md:gap-3 py-1.5 hide-scrollbar relative"
            style={{ scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                data-active={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
                className="relative flex h-10 shrink-0 items-center justify-center px-5 text-xs font-black uppercase tracking-wider transition-colors duration-300 rounded-full select-none outline-none cursor-pointer"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategoryBubble"
                    className="absolute inset-0 bg-[#004d40] rounded-full -z-10 shadow-lg shadow-[#004d40]/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-300 ${activeCategory === cat
                    ? 'text-white'
                    : 'text-gray-500 hover:text-[#004d40]'
                    }`}
                >
                  {cat}
                </span>
              </button>
            ))}
          </div>

          {/* Right Gradient Fade overlay */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fcfcfc] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showRightShadow ? 'opacity-100' : 'opacity-0'
              }`}
          />
        </div>

        {/* Search & Sort Panel */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-shrink-0">

          {/* Live Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-[200px] h-10">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 flex items-center justify-center h-5 w-5 ${
              isSearchFocused ? 'text-[#004d40]' : 'text-gray-400'
            }`}>
              <span className="material-symbols-outlined text-xl leading-none">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search perspectives..."
              className="w-full h-full bg-white border border-gray-200 hover:border-[#004d40] rounded-full pl-11 pr-10 text-sm text-[#1a1c1b] placeholder-gray-400 focus:outline-none focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/10 shadow-sm transition-all duration-300"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004d40] transition-colors cursor-pointer flex items-center justify-center h-5 w-5"
              >
                <span className="material-symbols-outlined text-lg leading-none">close</span>
              </button>
            )}
          </div>

          {/* Custom Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex h-10 items-center justify-between gap-3 px-5 rounded-full border bg-white text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer min-w-[180px] ${isSortOpen
                ? 'border-[#004d40] text-[#004d40] ring-2 ring-[#004d40]/10'
                : 'border-gray-200 text-gray-600 hover:border-[#004d40]'
                }`}
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">sort</span>
                <span>{SORT_LABELS[sortBy]}</span>
              </div>
              <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>

            {/* Floating Menu */}
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-100 shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${sortBy === option
                        ? 'bg-[#004d40]/5 text-[#004d40]'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#004d40]'
                        }`}
                      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {SORT_LABELS[option]}
                      {sortBy === option && (
                        <span className="material-symbols-outlined text-sm text-[#ffb800]">check</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Filter Status Summary */}
      {(searchQuery || activeCategory !== 'All Articles') && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#004d40]/5 border border-[#004d40]/10 rounded-2xl -mt-6">
          <div className="flex items-center gap-3 text-[#004d40] text-sm" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            <span className="material-symbols-outlined text-xl">info</span>
            <span className="font-medium">
              Showing {filteredAndSortedPosts.length} articles matching{' '}
              {searchQuery && <span className="font-black text-[#1a1c1b]">"{searchQuery}"</span>}
              {searchQuery && activeCategory !== 'All Articles' && ' and '}
              {activeCategory !== 'All Articles' && (
                <span className="font-black text-[#1a1c1b]">{activeCategory}</span>
              )}
            </span>
          </div>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#004d40] hover:text-[#ffb800] transition-colors"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            Clear all filters
          </button>
        </div>
      )}

      {/* Article Grid with Framer Motion Layout Animation */}
      {visiblePosts.length === 0 ? (
        <div className="text-center py-32 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6 text-gray-400">
            <span className="material-symbols-outlined text-3xl">menu_book</span>
          </div>
          <h3 className="text-xl font-medium text-[#1a1c1b] mb-2">No matching perspectives</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            We couldn't find any articles matching your search criteria. Try choosing another category or clearing search query.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#004d40] hover:bg-[#003d33] px-6 py-3 text-xs font-black text-white uppercase tracking-wider transition-all duration-300"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Reset Search
          </button>
        </div>
      ) : (
        <motion.div
          layout="position"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
        >
          <AnimatePresence mode="popLayout">
            {visiblePosts.map((post) => (
              <motion.article
                layout
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6 group"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="overflow-hidden rounded-[2rem] aspect-[16/10] w-full bg-gray-100 relative shadow-md ring-1 ring-black/5 block"
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="absolute inset-0 bg-[#004d40]/0 group-hover:bg-[#004d40]/10 transition-colors duration-700" />
                </Link>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    <span className="text-[#ffb800] text-xs font-black uppercase tracking-[0.2em]">{post.category}</span>
                    <span className="text-gray-400 text-xs font-bold">{post.shortDate}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-[#1a1c1b] text-3xl font-medium leading-tight group-hover:text-[#004d40] transition-colors duration-300">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-500 text-lg font-light leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-2 text-[#004d40] text-sm font-black group/link"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    <span className="tracking-widest uppercase">Read Article</span>
                    <span className="material-symbols-outlined text-xl transition-transform group-hover/link:translate-x-2">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination / Load More Button */}
      {hasMore && (
        <div className="flex justify-center py-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="group flex items-center justify-center gap-4 rounded-full border-2 border-[#004d40]/10 bg-white px-12 py-5 text-sm font-black text-[#004d40] hover:bg-[#004d40] hover:text-white hover:border-transparent transition-all duration-500 shadow-sm hover:shadow-2xl"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-700">
              refresh
            </span>
            <span className="uppercase tracking-widest">Load More Perspectives</span>
          </button>
        </div>
      )}
    </div>
  );
}
