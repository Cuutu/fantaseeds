'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ContactModal from '../ContactModal';

export default function Hero() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/8JzQ6Z8l4gA');

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) {
          const videoSetting = data.settings.find(s => s.key === 'youtube_video_url');
          if (videoSetting && videoSetting.value) {
            // Convertir link normal a embed si es necesario
            let url = videoSetting.value;
            if (url.includes('watch?v=')) {
              url = url.replace('watch?v=', 'embed/');
            }
            setVideoUrl(url);
          }
        }
      } catch (e) { /* ignorar error */ }
    }
    fetchVideoUrl();
  }, []);

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

      <div className="relative h-screen flex flex-col lg:flex-row justify-center items-center px-4 sm:px-6 lg:px-8 gap-12">
        <ScrollReveal>
          <div className="flex flex-col items-center lg:items-start justify-center flex-1 min-w-[320px] max-w-md w-full space-y-8">
            <div className="w-full flex flex-col items-center lg:items-start">
              <Image
                src="https://i.imgur.com/YcJ9dfr.png"
                alt="FANTASEEDS"
                width={400}
                height={120}
                className="w-full max-w-[260px] h-auto mb-4"
                priority
              />
              <span className="block text-white text-lg font-semibold tracking-wide mb-2">ONG DE LA SALUD</span>
            </div>
            <ScrollReveal delay={200}>
              <button
                onClick={handleContactClick}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-base shadow-lg hover:shadow-xl w-full max-w-[200px]"
              >
                ¡INSCRIBITE!
              </button>
            </ScrollReveal>
          </div>
        </ScrollReveal>
        {/* Video YouTube */}
        <div className="flex-1 flex justify-center items-center w-full max-w-3xl min-w-[320px]">
          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800 bg-black min-h-[320px] max-h-[480px]">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="Bienvenidos a Fantaseeds"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
} 