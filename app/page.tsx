import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Capabilities from '@/components/Capabilities';
import ChatSection from '@/components/ChatSection';
import ForBuilders from '@/components/ForBuilders';
import Disclaimer from '@/components/Disclaimer';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <Capabilities />
      <ChatSection />
      <ForBuilders />
      <Disclaimer />
      <Footer />
    </div>
  );
}
