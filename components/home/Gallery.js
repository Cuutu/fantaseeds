import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function Gallery() {
  const images = [
    {
      src: "https://i.imgur.com/8I9VORo.png",
      alt: "Nuestro cultivo"
    },
    {
      src: "https://i.imgur.com/xJbzgw1.png",
      alt: "Nuestro cultivo"
    },
    {
      src: "https://i.imgur.com/OCngmuA.png",
      alt: "Nuestro cultivo"
    },
    {
      src: "https://i.imgur.com/UEDUqYQ.png",
      alt: "Nuestro cultivo"
    },
    {
      src: "https://i.imgur.com/fNPmV5y.png",
      alt: "Nuestro cultivo"
    },
    {
      src: "https://i.imgur.com/GdDHWBa.png",
      alt: "Nuestro cultivo"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Nuestras Instalaciones
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="group relative h-72 rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold">{image.alt}</h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
} 