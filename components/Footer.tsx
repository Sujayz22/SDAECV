import Content from './FooterContent';
import { getServiceTimes } from '@/lib/sanity/timings';

export default async function Footer() {
    const serviceTimes = await getServiceTimes();
    return (
        <footer className="w-full bg-[#140d23] border-t border-white/[0.05]">
            <Content serviceTimes={serviceTimes} />
        </footer>
    );
}
