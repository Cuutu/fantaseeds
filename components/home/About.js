'use client';
import { useEffect, useRef } from 'react';

function About() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          ref={el => sectionRefs.current[0] = el}
          className="text-4xl font-bold text-center mb-12 text-green-400 opacity-0 translate-y-10 transition-all duration-700"
        >
          Bienvenidos a FANTASEEDS
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div 
            ref={el => sectionRefs.current[1] = el}
            className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 opacity-0 translate-y-10 transition-all duration-700"
          >
            <h3 className="text-2xl font-semibold mb-4 text-white">¿Quiénes Somos?</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              FANTASEEDS es un club cannábico comprometido con proporcionar acceso 
              seguro y legal al cannabis medicinal. Nos especializamos en cultivar 
              y proveer genéticas de alta calidad para nuestros miembros.
            </p>
          </div>
          <div 
            ref={el => sectionRefs.current[2] = el}
            className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 opacity-0 translate-y-10 transition-all duration-700"
          >
            <h3 className="text-2xl font-semibold mb-4 text-white">Nuestra Misión</h3>
            <p className="text-gray-300 text-lg mb-4">
              En FANTASEEDS, nos dedicamos a:
            </p>
            <ul className="space-y-3 text-gray-300 text-lg">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">•</span>
                Cultivar genéticas premium de cannabis medicinal
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">•</span>
                Brindar asesoramiento personalizado
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">•</span>
                Garantizar acceso seguro y legal
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">•</span>
                Educar sobre el uso responsable
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About; 