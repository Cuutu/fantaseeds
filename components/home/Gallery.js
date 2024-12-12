'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { EB_Garamond } from 'next/font/google';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ebGaramond = EB_Garamond({ subsets: ['latin'] });

export default function Gallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Verificar al montar
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const images = [
    {
      src: "/images/imagen4.png",
      alt: "INSTALACIONES DEL CLUB"
    },
    {
      src: "/images/imagen3.png",
      alt: "CALIDAD"
    },
    {
      src: "/images/imagen2.png",
      alt: "TERPENOS"
    },
    {
      src: "/images/imagen1.png",
      alt: "CULTIVO INDOOR"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: !isMobile ? <NextArrow /> : null,
    prevArrow: !isMobile ? <PrevArrow /> : null,
    beforeChange: (current, next) => setCurrentSlide(next),
    autoplay: isMobile, // Autoplay solo en móvil
    autoplaySpeed: 3000,
    arrows: !isMobile, // Ocultar flechas en móvil
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          arrows: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          dots: true,
          arrows: false,
          autoplay: true
        }
      }
    ]
  };

  return (
    <section id="gallery" className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#2D2D2D' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 
            text-[#CDA500] ${ebGaramond.className}`}
          >
            NUESTRAS INSTALACIONES
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="relative group">
            {/* Efectos de hover solo en desktop */}
            <div className="hidden sm:block">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg 
                blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"
              />
              <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-0 
                group-hover:opacity-10 transition-opacity duration-300"
              />
            </div>
            
            <div className="relative bg-transparent rounded-lg shadow-xl backdrop-blur-sm 
              border border-gray-700/50 group-hover:border-amber-500/30 transition-colors duration-300"
            >
              <div className="max-w-full overflow-hidden">
                <Slider {...settings}>
                  {images.map((image, index) => (
                    <div key={index} className="outline-none focus:outline-none px-0">
                      <div className="relative aspect-video sm:aspect-[16/9]">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 
                                 (max-width: 768px) 90vw, 
                                 (max-width: 1024px) 80vw,
                                 (max-width: 1280px) 70vw,
                                 60vw"
                          priority={index === 0}
                          style={{ 
                            objectFit: 'cover',
                            borderRadius: '0.5rem'
                          }}
                          className="!rounded-lg focus:outline-none"
                        />
                        {/* Título de la imagen */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 sm:p-4
                          text-white text-center text-sm sm:text-base rounded-b-lg"
                        >
                          {image.alt}
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 
        p-1 sm:p-2 rounded-full bg-green-500/80 hover:bg-green-500 
        transition-colors text-white hidden sm:block"
      aria-label="Siguiente imagen"
    >
      <FiChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
    </button>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors text-white hidden sm:block"
      aria-label="Imagen anterior"
    >
      <FiChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
    </button>
  );
} 