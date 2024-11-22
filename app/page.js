import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import ReprocannInfo from '@/components/home/ReprocannInfo';
import LawInfo from '@/components/home/LawInfo';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';
import Gallery from '@/components/home/Gallery';

export default function Home() {
  return (
    <main 
      className="min-h-screen" 
      style={{
        background: `linear-gradient(
          180deg, 
          #2C2C2C 0%,    /* Gris oscuro elegante */
          #3E3E3E 20%,   /* Gris medio oscuro */
          #4A4A4A 40%,   /* Gris medio */
          #575757 60%,   /* Gris medio claro */
          #636363 80%,   /* Gris claro suave */
          #707070 100%   /* Gris claro elegante */
        )`
      }}
    >
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
