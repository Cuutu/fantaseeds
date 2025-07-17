'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ContactModal from '../ContactModal';

export default function Hero() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/8JzQ6Z8l4gA');
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) {
          const videoSetting = data.settings.find(s => s.key === 'youtube_video_url');
          if (videoSetting && videoSetting.value) {
            // Detectar si es un Short o video normal
            const url = videoSetting.value;
            const isShortVideo = url.includes('/shorts/');
            setIsShort(isShortVideo);
            
            // Convertir link a embed
            let embedUrl = url;
            if (url.includes('watch?v=')) {
              embedUrl = url.replace('watch?v=', 'embed/');
            } else if (url.includes('/shorts/')) {
              embedUrl = url.replace('/shorts/', '/embed/');
            }
            setVideoUrl(embedUrl);
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

      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 gap-8 lg:gap-16">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[320px] max-w-md w-full py-8 lg:py-0">
          <Image
            src="https://i.imgur.com/YcJ9dfr.png"
            alt="FANTASEEDS"
            width={400}
            height={120}
            className="w-full max-w-[260px] h-auto mb-8 lg:mb-12"
            priority
          />
          <button
            onClick={handleContactClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-base shadow-lg hover:shadow-xl max-w-[200px] block mx-auto"
          >
            ¡INSCRIBITE!
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center w-full max-w-3xl min-w-[320px] py-8 lg:py-0">
          <div className={`w-full rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800 bg-black ${
            isShort 
              ? 'aspect-[9/16] max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] min-h-[400px] max-h-[640px]' 
              : 'aspect-[16/9] min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[400px] max-h-[480px]'
          }`}>
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