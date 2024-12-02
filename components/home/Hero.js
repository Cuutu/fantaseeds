'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ContactModal from '../ContactModal';

export default function Hero() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
          backdropFilter: 'blur(2px)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))'
        }}
      />

      <div className="relative h-full flex items-center justify-center">
        <ScrollReveal>
          <div className="text-center px-4">
            <div className="space-y-4">
              <div className="relative w-full max-w-lg mx-auto">
                <Image
                  src="https://i.imgur.com/YcJ9dfr.png"
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
                onClick={() => setIsContactModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
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

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
} 