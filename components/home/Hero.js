'use client';

import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function Hero() {
  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <Image
          src="https://leafly-cms-production.imgix.net/wp-content/uploads/2020/10/13162934/zmoney-Courtesy-Talking-Trees-for-web.jpg"
          alt="Background"
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
          priority
        />
      </div>

      <div 
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(4px)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))'
        }}
      />

      <div className="relative h-full flex items-center justify-center">
        <ScrollReveal>
          <div className="text-center px-4">
            <div className="space-y-4">
              <div className="relative w-full max-w-lg mx-auto">
                <Image
                  src="https://imgur.com/XTwltQ6.png"
                  alt="FANTASEEDS"
                  width={500}
                  height={150}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
            <ScrollReveal delay={200}>
              <button 
                onClick={scrollToAbout}
                className="mt-6 sm:mt-8 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full 
                          transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
              >
                ¡INSCRIBITE!
              </button>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white"
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
} 