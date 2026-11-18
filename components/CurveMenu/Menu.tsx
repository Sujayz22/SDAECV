'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Curve from './Curve';
import WatchLiveButton from '../WatchLiveButton';

interface NavChild {
    name: string;
    href: string;
}

interface NavItem {
    name: string;
    href?: string;
    children?: NavChild[];
}

const menuSlide = {
    initial: { y: '-100%' },
    enter: { y: '0%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any } },
    exit: { y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any } },
};

const slide = {
    initial: { y: 80, opacity: 0 },
    enter: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any, delay: 0.05 * i },
    }),
    exit: (i: number) => ({
        y: 80,
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any, delay: 0.05 * i },
    }),
};

const subMenuContainer = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: {
            height: { type: 'spring' as const, stiffness: 300, damping: 30 },
            opacity: { duration: 0.3, ease: 'easeOut' as const },
            staggerChildren: 0.06,
            delayChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: {
            height: { type: 'spring' as const, stiffness: 400, damping: 35 },
            opacity: { duration: 0.15 },
            staggerChildren: 0.03,
            staggerDirection: -1,
        },
    },
};

const subMenuItem = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        y: -5,
        scale: 0.98,
        transition: { duration: 0.15, ease: 'easeIn' as const },
    },
};

export default function Menu({ navItems, closeMenu }: { navItems: NavItem[], closeMenu: () => void }) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <motion.div
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed left-0 top-0 h-screen w-full bg-[#F6F1EB] text-black z-40 flex flex-col"
        >
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center pt-20 pb-4 overflow-y-auto">
                {navItems.map((data, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        variants={slide}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        className="overflow-visible"
                        onMouseEnter={() => data.children && setHoveredItem(data.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {data.children ? (
                            <div className="flex flex-col items-center">
                                <span className="text-5xl md:text-6xl lg:text-7xl font-display font-medium uppercase tracking-tighter hover:text-[#e36520] transition-colors cursor-pointer block">
                                    {data.name}
                                </span>
                                <AnimatePresence>
                                    {hoveredItem === data.name && (
                                        <motion.div
                                            variants={subMenuContainer}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-3 overflow-hidden"
                                        >
                                            {data.children.map((child, childIndex) => (
                                                <motion.div key={childIndex} variants={subMenuItem}>
                                                    <Link
                                                        href={child.href}
                                                        onClick={closeMenu}
                                                        className="text-xl md:text-2xl font-display font-medium uppercase tracking-tight hover:text-[#e36520] transition-colors inline-block"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href={data.href || '#'}
                                onClick={closeMenu}
                                className="text-5xl md:text-6xl lg:text-7xl font-display font-medium uppercase tracking-tighter hover:text-[#e36520] transition-colors block"
                            >
                                {data.name}
                            </Link>
                        )}
                    </motion.div>
                ))}

                {/* Mobile Action Buttons */}
                <motion.div
                    custom={navItems.length}
                    variants={slide}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="flex min-[1033px]:hidden flex-col sm:flex-row gap-3 mt-8"
                >
                    <Link
                        href="/give"
                        onClick={closeMenu}
                        className="text-base font-bold uppercase tracking-widest px-8 py-3 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-center"
                    >
                        Give
                    </Link>
                    <WatchLiveButton
                        onClick={closeMenu}
                        isMobile={true}
                    />
                </motion.div>
            </div>
            <Curve />
        </motion.div>
    );
}
