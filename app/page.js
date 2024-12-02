'use client';
import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import ReprocannInfo from '@/components/home/ReprocannInfo';
import LawInfo from '@/components/home/LawInfo';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';
import Gallery from '@/components/home/Gallery';

// Importar el modal de forma dinámica
const AgeVerificationModal = dynamic(() => import('@/components/AgeVerificationModal'), {
  ssr: false
});

export default function Home() {
  return (
    <>
      <AgeVerificationModal />
      <main 
        className="min-h-screen" 
        style={{
          background: `linear-gradient(
            180deg, 
            #2C2C2C 0%,
            #3E3E3E 20%,
            #4A4A4A 40%,
            #575757 60%,
            #636363 80%,
            #707070 100%
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
    </>
  );
}
