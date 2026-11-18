import Link from 'next/link';

export default function HomeCTA() {
    return (
        <section className="w-full py-32 px-6 bg-[#f8f4ef] relative overflow-hidden">
            {/* decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#5b2d9c]/4 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#e36520]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

            <div className="relative max-w-5xl mx-auto z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white rounded-3xl border border-[#140d23]/5 p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(20,13,35,0.10)]">
                    <div className="flex flex-col gap-4 max-w-lg text-left">
                        <span className="text-[#e36520] font-bold tracking-widest uppercase text-xs">You&apos;re Welcome Here</span>
                        <h2
                            className="text-4xl md:text-5xl text-[#140d23] leading-tight tracking-tight"
                            style={{ fontFamily: 'var(--font-newsreader)' }}
                        >
                            Come as you <em className="italic text-[#5b2d9c]">are</em>.
                        </h2>
                        <p className="text-[#7a6d8e] text-lg leading-relaxed">
                            Worship with us this Saturday in Vellore. Discover a warm, welcoming community of faith, fellowship, and service.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                        <Link
                            href="/visit"
                            className="flex items-center justify-center gap-2 bg-[#e36520] text-white hover:bg-[#c9571a] font-bold py-4 px-10 rounded-full shadow-lg shadow-[#e36520]/30 transition-all hover:-translate-y-1 hover:scale-105"
                        >
                            Plan a Visit
                        </Link>
                        <Link
                            href="/live"
                            className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#140d23]/10 text-[#140d23] hover:border-[#5b2d9c] hover:text-[#5b2d9c] font-bold py-4 px-10 rounded-full transition-all hover:-translate-y-1"
                        >
                            Join Online
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
