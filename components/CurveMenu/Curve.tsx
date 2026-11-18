'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Curve() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });

        const resize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    // Curve is at the bottom, so Y is height.
    // Initial: Flat line at the top (before drop) -> No, we want it to be part of the moving container.
    // The Container moves from -100% to 0. 
    // The Curve is absolute positioned at the BOTTOM of the container.
    // So the curve should hang DOWNWARDS.

    // M0 0 Lwidth 0 Qwidth/2 100 width 0 ... 
    // Wait, SVG height is 100px.
    // Path starts at 0, goes to width.
    // Quad point is in the middle at y=100 (bottom of SVG).

    const initialPath = `M0 0 L${dimensions.width} 0 Q${dimensions.width / 2} 0 ${dimensions.width} 0`;
    const targetPath = `M0 0 L${dimensions.width} 0 Q${dimensions.width / 2} 100 ${dimensions.width} 0`;

    const curve = {
        initial: {
            d: initialPath,
        },
        enter: {
            d: targetPath,
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as any },
        },
        exit: {
            d: initialPath,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
        },
    };

    return (
        <svg className="absolute bottom-[-99px] left-0 w-full h-[100px] fill-[#F6F1EB] stroke-none z-10 pointer-events-none">
            <motion.path variants={curve} initial="initial" animate="enter" exit="exit"></motion.path>
        </svg>
    );
}
