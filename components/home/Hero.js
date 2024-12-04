'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ContactModal from '../ContactModal';

export default function Hero() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    const isSmallScreen = window.innerWidth < 768; // Ajusta el tamaño según el modal
    if (isSmallScreen) {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsContactModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <Image
          src="https://leafly-cms-production.imgix.net/wp-content/uploads/2020/10/13162934/zmoney-Courtesy-Talking-Trees-for-web.jpg"
          alt="Background"
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.7) contrast(1.1)'
          }}
          priority
        />
      </div>

      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))'
        }}
      />

      <div className="relative h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <div className="space-y-4">
              <div className="relative w-full max-w-[200px] sm:max-w-[280px] mx-auto">
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
                onClick={handleContactClick}
                className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold 
                         py-3 px-8 rounded-full transition-all duration-300 
                         transform hover:scale-105 text-base
                         shadow-lg hover:shadow-xl"
              >
                ¡INSCRIBITE!
              </button>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
} 