import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import HistoryClient from './HistoryClient';

export const metadata: Metadata = {
  title: 'Our History — SDAECV | Seventh-day Adventist English Church, Vellore',
  description:
    'Discover the rich history of the Seventh-day Adventist English Church in Vellore — from its founding in 1958 with 23 charter members at Maranatha Bungalow to a congregation whose alumni serve across the globe.',
};

export default function HistoryPage() {
  return (
    <SmoothScroll>
      <div className="relative z-10 bg-[#f8f4ef]">
        <Navbar dark={true} />
        <HistoryClient />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
