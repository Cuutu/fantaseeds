'use client';
import { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ScrollReveal from '../ScrollReveal';

// Importar los estilos de slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      src: "https://i.imgur.com/OCngmuA.png",
      alt: "Terpenos"
    },
    {
      src: "https://i.imgur.com/UEDUqYQ.png",
      alt: "Calidad"
    },
    {
      src: "https://i.imgur.com/fNPmV5y.png",
      alt: "Cultivo"
    },
    {
      src: "https://i.imgur.com/GdDHWBa.png",
      alt: "Instalaciones del "
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentSlide(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i) => (
      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-green-500 w-4' : 'bg-gray-500'}`} />
    ),
    dotsClass: 'slick-dots !bottom-[-3rem]'
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Nuestras Instalaciones
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative">
            <Slider {...settings}>
              {images.map((image, index) => (
                <div key={index} className="outline-none">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-2xl font-semibold text-center">
                        {image.alt}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Componentes para las flechas personalizadas
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