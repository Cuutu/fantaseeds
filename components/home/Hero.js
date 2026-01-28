'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ContactModal from '../ContactModal';

export default function Hero() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/ESZQGGiZ_KU?rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autoplay=1&mute=1&enablejsapi=1&playsinline=1');
  const [isShort, setIsShort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [iframeRef, setIframeRef] = useState(null);
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
    
    // Parámetros optimizados - iniciar silenciado para luego controlar volumen
    const params = new URLSearchParams({
      rel: '0',              // No mostrar videos relacionados
      modestbranding: '1',   // Menos branding de YouTube
      controls: '1',         // Mostrar controles
      showinfo: '0',         // No mostrar info del video
      fs: '1',               // Permitir pantalla completa
      cc_load_policy: '0',   // No cargar subtítulos automáticamente
      iv_load_policy: '3',   // No cargar anotaciones
      autoplay: '1',         // Reproducir automáticamente
      mute: '1',             // Iniciar silenciado para luego controlar
      enablejsapi: '1',      // Habilitar JavaScript API
      playsinline: '1',      // Para móviles
      origin: typeof window !== 'undefined' ? window.location.origin : ''
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Cargar la API de YouTube para control avanzado
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      
      window.onYouTubeIframeAPIReady = () => {
        console.log('🎵 YouTube API cargada');
      };
    }
  }, []);

  useEffect(() => {
    async function fetchVideoUrl() {
      console.log('🎬 Iniciando carga de video...');
      setLoading(true);
      try {
        const res = await fetch('/api/admin/settings');
        console.log('📡 Respuesta de API settings:', res.status);
        
        const data = await res.json();
        console.log('📋 Datos recibidos:', data);
        
        if (data.success) {
          const videoSetting = data.settings.find(s => s.key === 'youtube_video_url');
          console.log('🔍 Video setting encontrado:', videoSetting);
          
          if (videoSetting && videoSetting.value) {
            // Detectar si es un Short o video normal
            const url = videoSetting.value;
            console.log('🎥 URL del video:', url);
            
            const isShortVideo = url.includes('/shorts/');
            setIsShort(isShortVideo);
            console.log('📱 Es Short:', isShortVideo);
            
            // Extraer ID del video
            const extractedVideoId = getVideoId(url);
            console.log('🆔 ID extraído:', extractedVideoId);
            
            // Convertir link a embed con parámetros optimizados
            const embedUrl = getEmbedUrl(url);
            console.log('🔗 URL embed generada:', embedUrl);
            
            setVideoUrl(embedUrl);
            console.log('✅ Video configurado correctamente');
          } else {
            console.log('⚠️ No se encontró configuración de video, usando por defecto');
          }
        } else {
          console.log('❌ Error en la respuesta:', data);
        }
      } catch (e) { 
        console.log('💥 Error cargando video:', e);
        // Mantener video por defecto
      } finally {
        setLoading(false);
        console.log('🏁 Carga de video finalizada');
      }
    }
    fetchVideoUrl();
  }, []);

  // Configurar player cuando el iframe esté listo
  useEffect(() => {
    if (!iframeRef) return;

    const setupPlayerControl = () => {
      if (window.YT && window.YT.Player) {
        try {
          console.log('🎛️ Configurando control del player...');
          
          const player = new window.YT.Player(iframeRef, {
            events: {
              onReady: (event) => {
                console.log('🎵 Player listo, configurando volumen al 20%');
                // Unmute primero, luego establecer volumen
                event.target.unMute();
                event.target.setVolume(20);
                console.log('🔊 Volumen establecido al 20%');
              },
              onStateChange: (event) => {
                console.log('📺 Estado del video cambiado:', event.data);
                // Estado 0 = ENDED
                if (event.data === 0) {
                  console.log('🎬 Video terminado, redirigiendo a membresías...');
                  setTimeout(() => {
                    router.push('/membresias');
                  }, 1000);
                }
              },
              onError: (event) => {
                console.log('❌ Error en el player:', event.data);
              }
            }
          });
        } catch (error) {
          console.log('💥 Error configurando player:', error);
        }
      } else {
        // Reintentar después de un tiempo si la API no está lista
        setTimeout(setupPlayerControl, 1000);
      }
    };

    // Esperar un poco para que el iframe se cargue completamente
    setTimeout(setupPlayerControl, 2000);
  }, [iframeRef, router]);

  // Manejar eventos de mensaje del iframe (fallback)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'onStateChange' && data.info === 0) {
            // Video terminó (estado 0) - fallback si el player directo no funciona
            console.log('🎬 Video terminado (fallback), redirigiendo a membresías...');
            setTimeout(() => {
              router.push('/membresias');
            }, 1000);
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleContactClick = () => {
    const isSmallScreen = window.innerWidth < 768;
    if (isSmallScreen) {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsContactModalOpen(true);
    }
  };

  const handleIframeLoad = (iframe) => {
    console.log('📺 Iframe cargado, configurando referencia...');
    setIframeRef(iframe);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

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
            src="/images/fantaseeds-logo.png"
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
              ref={handleIframeLoad}
              width="100%"
              height="100%"
              src={videoUrl}
              title="Bienvenidos a Fantaseeds"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
              id="youtube-iframe"
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