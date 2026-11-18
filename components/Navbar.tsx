'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import Menu from './CurveMenu/Menu';
import WatchLiveButton from './WatchLiveButton';

export default function Navbar({ dark = true }: { dark?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll and set class when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('navbar-menu-open');
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('navbar-menu-open');
        }
        return () => {
            document.body.classList.remove('navbar-menu-open');
        };
    }, [isOpen]);

    const navItems = [
        { name: 'Home', href: '/' },
        {
            name: 'About',
            children: [
                { name: 'About Us', href: '/about' },
                { name: 'Events', href: '/events' },
                { name: 'Connect', href: '/connect' },
            ],
        },
        {
            name: 'Media',
            children: [
                { name: 'Videos', href: '/media/videos' },
                { name: 'Blogs', href: '/blog' },
            ],
        },
        { name: 'Visit', href: '/visit' },
        { name: 'Resources', href: '/resources' },
    ];
    const linkColorClass = isOpen
        ? 'text-[#140d23]'
        : scrolled
            ? 'text-[#140d23]'
            : dark
                ? 'text-white'
                : 'text-[#140d23]';

    const logoSrc = (isOpen || scrolled || !dark) ? '/logo.png' : '/logo_white.png';

    return (
        <>
            <header
                className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${scrolled
                    ? 'bg-[#f8f4ef]/90 backdrop-blur-md border-b border-[#140d23]/8 py-3'
                    : 'bg-transparent border-b border-transparent py-5'
                    }`}
            >
                <div className="mx-auto flex h-25 max-w-[1440px] items-center justify-between px-6 md:px-12 lg:px-20">

                    {/* LEFT: Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="flex items-center gap-3 group cursor-pointer relative z-[60]">
                            <Image
                                src={logoSrc}
                                alt="SDAECV — Seventh Day Adventist English Church, Vellore"
                                width={120}
                                height={48}
                                className="object-contain h-20 w-auto"
                                priority={false}
                            />
                            {/* <span className={`text-base font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${linkColorClass}`}>
                                SDAECV
                            </span> */}
                        </Link>
                    </div>
                    {/* CENTER: Navigation Links (Desktop) / Hamburger Trigger (Mobile) */}
                    <div className="flex-1 flex justify-end min-[1033px]:justify-center">
                        {/* Hamburger Trigger (Mobile only) */}
                        <button
                            className={`flex items-center gap-2.5 cursor-pointer z-[60] transition-colors duration-300 min-[1033px]:hidden ${linkColorClass}`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className="flex flex-col gap-[5px] w-5">
                                <span className={`h-[1.5px] w-full bg-current transform transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                                <span className={`h-[1.5px] w-full bg-current transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                                <span className={`h-[1.5px] w-full bg-current transform transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] hidden sm:block">
                                {isOpen ? 'Close' : 'Menu'}
                            </span>
                        </button>
 
                        {/* Desktop Navigation Links */}
                        <nav className="hidden min-[1033px]:flex items-center gap-8 z-[60]">
                            {navItems.map((item) => {
                                const hasChildren = !!item.children;
                                return (
                                    <div key={item.name} className="group relative py-2">
                                        {hasChildren ? (
                                            <>
                                                <button
                                                    className={`flex items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer transition-colors duration-300 hover:text-[#e36520] ${linkColorClass}`}
                                                >
                                                    {item.name}
                                                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">keyboard_arrow_down</span>
                                                </button>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3.5 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                                                    <div className={`rounded-2xl border p-2 min-w-[200px] flex flex-col gap-1 shadow-2xl backdrop-blur-xl transition-all duration-300 ${scrolled || !dark
                                                        ? 'bg-[#f8f4ef]/75 border-[#140d23]/5 text-[#140d23]'
                                                        : 'bg-[#140d23]/75 border-white/8 text-white'
                                                        }`}>
                                                        {item.children!.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                href={subItem.href}
                                                                className={`px-4 py-2.5 text-[13px] font-semibold tracking-wide rounded-xl transition-all duration-200 ${scrolled || !dark
                                                                    ? 'hover:bg-[#e36520]/8 hover:text-[#e36520] text-[#140d23]/80'
                                                                    : 'hover:bg-white/8 hover:text-[#e36520] text-white/80'
                                                                    }`}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href!}
                                                className={`relative text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#e36520] ${linkColorClass} after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-[#e36520] after:transition-transform after:duration-300 hover:after:scale-x-100 origin-center`}
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
 
                    {/* RIGHT: Actions */}
                    <div className="flex-1 hidden min-[1033px]:flex justify-end items-center gap-3">
                        <Link
                            href="/give"
                            className={`text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full border transition-all duration-300 z-[60] ${isOpen || scrolled || !dark
                                ? 'border-[#140d23] text-[#140d23] hover:bg-[#140d23] hover:text-white'
                                : 'border-white/40 text-white hover:bg-white hover:text-[#140d23]'
                                }`}
                        >
                            Give
                        </Link>
                        <WatchLiveButton 
                            dark={dark} 
                            scrolled={scrolled} 
                            isOpen={isOpen} 
                            className="z-[60]" 
                        />
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {isOpen && <Menu navItems={navItems} closeMenu={() => setIsOpen(false)} />}
            </AnimatePresence>
        </>
    );
}
