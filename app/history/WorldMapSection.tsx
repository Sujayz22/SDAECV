'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Map,
  MapMarker,
  MapArc,
  MarkerContent,
} from '@/components/ui/map';

// ─── STYLING VARIANTS ─────────────────────────────────────────────────────────

const clipReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: (i = 0) => ({
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: { duration: 1.1, delay: i * 0.15, ease: [0.76, 0, 0.24, 1] as const },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const lineGrow = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } },
};

// ─── GEOGRAPHICAL COORDINATES [longitude, latitude] ──────────────────────────

const COUNTRY_NODES = [
  { name: 'India', lng: 79.1325, lat: 12.9165, delay: 0.2 },
  { name: 'Pakistan', lng: 67.0011, lat: 24.8607, delay: 0.5 },
  { name: 'Nepal', lng: 85.3240, lat: 27.7172, delay: 0.8 },
  { name: 'Bhutan', lng: 89.6390, lat: 27.4728, delay: 1.0 },
  { name: 'Sri Lanka', lng: 79.8612, lat: 6.9271, delay: 1.2 },
  { name: 'Burma', lng: 96.1951, lat: 16.8661, delay: 1.4 },
  { name: 'Malaysia', lng: 101.6869, lat: 3.1390, delay: 1.7 },
  { name: 'Singapore', lng: 103.8198, lat: 1.3521, delay: 2.0 },
];

const VELLORE = { name: 'Vellore', lng: 79.1358917, lat: 12.8837302 };

export default function WorldMapSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [viewport, setViewport] = useState({
    center: [84.0, 15.0] as [number, number],
    zoom: 3.7,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setViewport({ center: [84.0, 15.0], zoom: 2.3 });
      } else if (w < 1024) {
        setViewport({ center: [84.0, 15.0], zoom: 3.0 });
      } else {
        setViewport({ center: [84.0, 15.0], zoom: 3.7 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section ref={ref} id="history-map-section" className="relative py-32 md:py-48 bg-[#0b0814] overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#5b2d9c]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#e36520]/6 blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Header Section */}
        <div className="max-w-4xl mb-16 text-left">
          <div className="w-full">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#e36520]" />
              <span className="text-[#e36520] text-[9px] font-black uppercase tracking-[0.45em]">Global Legacy</span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                variants={clipReveal} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.025em', color: '#fff' }}
              >
                Alumni on<br />
                <em className="italic font-normal text-white/20">Every Continent</em>
              </motion.h2>
            </div>

            <motion.div variants={lineGrow} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="h-px origin-left my-7" style={{ background: 'linear-gradient(to right,#e36520,transparent)' }} />

            <motion.p variants={fadeUp} custom={3} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-white/45 font-baskerville text-[15px] leading-[1.9] max-w-3xl">
              The Seventh-day Adventist English Church, Vellore, has been a pioneering
              spiritual institution since 1947, dedicated to nurturing young Christian leaders,
              especially among students of Christian Medical College (CMC), Vellore.
              From Dr. John Quinn, one of the earliest members, to present-day CMC
              students, the church has provided a foundation in leadership, spiritual training,
              and the art of self-discipline, preparing youth to serve as Christ’s ambassadors.
              Over the decades, these students have gone on to serve across India, Pakistan,
              Nepal, Bhutan, Sri Lanka, Burma, Malaysia, and Singapore, establishing
              Adventist hospitals, sanatoriums, and medical educational services, particularly
              within the Southern Asia Division and Southern Asia Pacific Ocean Division — a legacy that has continued for over 79
              years.
              Today, alumni from this church are present on every continent, serving the
              Lord in diverse and impactful ways.
            </motion.p>

            {/* Mini Stats */}
            <motion.div variants={fadeUp} custom={4} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mt-10 grid grid-cols-3 gap-6 max-w-2xl">
              {[['8', 'Countries'], ['2', 'Divisions'], ['79+', 'Years']].map(([n, l]) => (
                <div key={l} className="flex flex-col gap-2">
                  <span className="text-white font-bold" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '2rem' }}>{n}</span>
                  <div className="h-px bg-white/10" />
                  <span className="text-white/35 text-[10px] tracking-widest uppercase font-bold">{l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Maplibre Map Container */}
        <motion.div
          variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="relative w-full h-[550px] rounded-2xl overflow-hidden border border-white/5 bg-[#07050b]"
          style={{ height: '550px' }}
        >
          <Map
            theme="dark"
            viewport={viewport}
            onViewportChange={setViewport}
            interactive={false}
            dragPan={false}
            scrollZoom={false}
            boxZoom={false}
            dragRotate={false}
            keyboard={false}
            doubleClickZoom={false}
            touchZoomRotate={false}
            className="w-full h-full"
          >

            {/* Vellore (Origin Node) */}
            <MapMarker longitude={VELLORE.lng} latitude={VELLORE.lat}>
              <MarkerContent>
                <div className="relative flex items-center justify-center">
                  {/* Pulse Rings */}
                  {inView && (
                    <>
                      <div className="absolute w-14 h-14 rounded-full border border-[#e36520] animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '3.5s' }} />
                      <div className="absolute w-8 h-8 rounded-full border border-[#e36520] animate-ping opacity-40 pointer-events-none" style={{ animationDuration: '3.5s', animationDelay: '1.2s' }} />
                    </>
                  )}
                  {/* Solid core indicator */}
                  <div className="w-4 h-4 rounded-full bg-[#e36520] border-2 border-white shadow-[0_0_10px_rgba(227,101,32,0.6)] relative z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                  {/* Label */}
                  <span className="absolute left-6 text-[10px] font-bold tracking-wider text-white bg-[#0b0814]/90 px-2 py-1 rounded border border-white/10 whitespace-nowrap backdrop-blur-xs select-none shadow-lg">
                    Vellore (Origin)
                  </span>
                </div>
              </MarkerContent>
            </MapMarker>

            {/* Destination Markers */}
            {COUNTRY_NODES.slice(1).map((node) => (
              <MapMarker key={node.name} longitude={node.lng} latitude={node.lat}>
                <MarkerContent>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5b2d9c] border border-white/60 shadow-md relative z-10" />
                    <span className="absolute left-5 text-[9px] font-semibold text-white bg-[#0b0814]/80 px-1.5 py-0.5 rounded border border-white/5 whitespace-nowrap backdrop-blur-xs select-none">
                      {node.name}
                    </span>
                  </motion.div>
                </MarkerContent>
              </MapMarker>
            ))}

            {/* Arcs radiating from Vellore to target countries */}
            <MapArc
              data={COUNTRY_NODES.slice(1).map(node => ({
                id: node.name,
                from: [VELLORE.lng, VELLORE.lat] as [number, number],
                to: [node.lng, node.lat] as [number, number],
              }))}
              curvature={0.25}
              paint={{
                'line-color': '#e36520',
                'line-width': 2,
                'line-opacity': 0.8,
              }}
              hoverPaint={{
                'line-color': '#9061d4',
                'line-width': 3,
                'line-opacity': 1.0,
              }}
            />
          </Map>
        </motion.div>
      </div>
    </section>
  );
}
