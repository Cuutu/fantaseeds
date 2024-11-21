'use client';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            SOBRE EL CLUB
          </h2>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-2 gap-12">
          <ScrollReveal delay={200}>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-white">¿Quiénes Somos?</h3>
              <p className="text-gray-300 text-lg leading-relaxed space-y-4">
                FANTASEEDS es un club cannábico comprometido con proporcionar acceso seguro y legal al cannabis medicinal. 
                <br /><br />
                Nuestro compromiso es brindar una alternativa confiable y profesional para aquellos que buscan 
                mejorar su calidad de vida a través del cannabis medicinal.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-white">Nuestra Misión</h3>
              <ul className="space-y-4 text-gray-300 text-lg">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                  Cultivar genéticas premium
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                  Brindar asesoramiento personalizado
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                  Garantizar acceso seguro y legal
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                  Educar sobre el uso responsable
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
} 