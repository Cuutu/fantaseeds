import Hero from '../components/home/Hero';
import About from '../components/home/About';
import ReprocannInfo from '../components/home/ReprocannInfo';
import LawInfo from '../components/home/LawInfo';
import Contact from '../components/home/Contact';
import FAQ from '../components/home/FAQ';

function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <ReprocannInfo />
      <LawInfo />
      <Contact />
      <FAQ />
    </div>
  );
}

export default Home; 