'use client';
import { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { EB_Garamond } from 'next/font/google';

// Importar los estilos de slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ebGaramond = EB_Garamond({ subsets: ['latin'] });

export default function Gallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    {
      src: "https://i.imgur.com/xJbzgw1.png",
      alt: "Instalaciones del Club"
    },
    {
      src: "https://i.imgur.com/8I9VORo.png",
      alt: "Cultivo Indoor"
    },
    {
      src: "https://i.imgur.com/Yx8Qv6q.png",
      alt: "Área de Procesamiento"
    },
    {
      src: "https://i.imgur.com/Yx8Qv6q.png",
      alt: "Laboratorio"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  return (
    <section id="gallery" className="py-20" style={{ backgroundColor: '#2D2D2D' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className={`text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent ${ebGaramond.className}`}>
            Nuestras Instalaciones
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-transparent rounded-lg shadow-xl backdrop-blur-sm border border-gray-700/50 group-hover:border-amber-500/30 transition-colors duration-300">
              <Slider {...settings}>
                {images.map((image, index) => (
                  <div key={index} className="outline-none focus:outline-none">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        style={{ 
                          objectFit: 'cover',
                          borderRadius: '0.5rem'
                        }}
                        className="!rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
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
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors text-white"
      aria-label="Siguiente imagen"
    >
      <FiChevronRight className="w-6 h-6" />
    </button>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors text-white"
      aria-label="Imagen anterior"
    >
      <FiChevronLeft className="w-6 h-6" />
    </button>
  );
} 