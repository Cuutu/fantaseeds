'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ContactModal from '../ContactModal';

export default function Hero() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/ESZQGGiZ_KU');
  const [isShort, setIsShort] = useState(false);
  const [videoId, setVideoId] = useState('ESZQGGiZ_KU');
  const playerRef = useRef(null);
  const router = useRouter();

  // Extraer ID del video de YouTube
  const getVideoId = (url) => {
    if (!url) return null;
    
    // Para URLs normales: youtube.com/watch?v=ID
    const normalMatch = url.match(/[?&]v=([^&#]*)/);
    if (normalMatch) return normalMatch[1];
    
    // Para shorts: youtube.com/shorts/ID
    const shortsMatch = url.match(/\/shorts\/([^?&#]*)/);
    if (shortsMatch) return shortsMatch[1];
    
    // Para URLs cortas: youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&#]*)/);
    if (shortMatch) return shortMatch[1];
    
    return null;
  };
  
  // Convertir URL para embed con parámetros optimizados
  const getEmbedUrl = (url) => {
    const videoId = getVideoId(url);
    if (!videoId) return url;
    
    // Parámetros optimizados con autoplay y configuraciones para la API
    const params = new URLSearchParams({
      rel: '0',              // No mostrar videos relacionados
      modestbranding: '1',   // Menos branding de YouTube
      controls: '1',         // Mostrar controles
      showinfo: '0',         // No mostrar info del video
      fs: '1',               // Permitir pantalla completa
      cc_load_policy: '0',   // No cargar subtítulos automáticamente
      iv_load_policy: '3',   // No cargar anotaciones
      autoplay: '1',         // Reproducir automáticamente
      mute: '0',             // No silenciar (para controlar volumen)
      enablejsapi: '1',      // Habilitar JavaScript API
      playsinline: '1'       // Para móviles
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Cargar la API de YouTube
  useEffect(() => {
    // Cargar script de YouTube API si no está cargado
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API cargada');
      };
    }
  }, []);

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
            
            // Extraer ID del video
            const extractedVideoId = getVideoId(url);
            if (extractedVideoId) {
              setVideoId(extractedVideoId);
            }
            
            // Convertir link a embed con parámetros optimizados
            const embedUrl = getEmbedUrl(url);
            setVideoUrl(embedUrl);
          }
        }
      } catch (e) { 
        console.log('Error cargando video:', e);
        // Mantener video por defecto
        setVideoId('ESZQGGiZ_KU');
      }
    }
    fetchVideoUrl();
  }, []);

  // Configurar el player cuando esté listo
  useEffect(() => {
    const setupPlayer = () => {
      if (window.YT && window.YT.Player && playerRef.current) {
        try {
          const player = new window.YT.Player(playerRef.current, {
            videoId: videoId,
            playerVars: {
              rel: 0,
              modestbranding: 1,
              controls: 1,
              showinfo: 0,
              fs: 1,
              cc_load_policy: 0,
              iv_load_policy: 3,
              autoplay: 1,
              mute: 0,
              enablejsapi: 1,
              playsinline: 1
            },
            events: {
              onReady: (event) => {
                console.log('Player listo');
                // Establecer volumen al 20%
                event.target.setVolume(20);
                // Reproducir automáticamente
                event.target.playVideo();
              },
              onStateChange: (event) => {
                // Cuando el video termine (estado 0)
                if (event.data === window.YT.PlayerState.ENDED) {
                  console.log('Video terminado, redirigiendo a membresías...');
                  setTimeout(() => {
                    router.push('/membresias');
                  }, 1000); // Esperar 1 segundo antes de redirigir
                }
              },
              onError: (event) => {
                console.log('Error en el player:', event.data);
              }
            }
          });
        } catch (error) {
          console.log('Error creando player:', error);
        }
      }
    };

    // Si la API ya está cargada, configurar inmediatamente
    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      // Si no, esperar a que se cargue
      window.onYouTubeIframeAPIReady = setupPlayer;
    }
  }, [videoId, router]);

  const handleContactClick = () => {
    const isSmallScreen = window.innerWidth < 768;
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
            {/* Div contenedor para el player de YouTube */}
            <div
              ref={playerRef}
              className="w-full h-full"
              id="youtube-player"
            />
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