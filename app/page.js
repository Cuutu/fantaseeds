import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import ReprocannInfo from '@/components/home/ReprocannInfo';
import LawInfo from '@/components/home/LawInfo';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';
import Gallery from '@/components/home/Gallery';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Gallery />
      <ReprocannInfo />
      <LawInfo />
      <FAQ />
      <Contact />
    </main>
  );
}
