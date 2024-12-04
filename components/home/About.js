'use client';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { EB_Garamond } from 'next/font/google';
import { Tajawal } from 'next/font/google';

const ebGaramond = EB_Garamond({ subsets: ['latin'] });
const tajawal = Tajawal({ weight: ['400', '500', '700'], subsets: ['latin'] });

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-20" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className={`text-3xl sm:text-5xl font-bold text-center mb-8 sm:mb-16 text-[#CDA500] ${ebGaramond.className}`}>
            SOBRE EL CLUB
          </h2>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
          <ScrollReveal delay={200}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-black p-4 sm:p-8 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700/50 group-hover:border-amber-500/30 transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">¿Quiénes Somos?</h3>
                <p className={`text-gray-300 text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-4 ${tajawal.className}`}>
                  Somos una ONG DE LA SALUD de cannabis medicinal.
                  <br className="hidden sm:block" />
                  Ofrecemos un servicio seguro, legal y exclusivo, cumpliendo con los más altos estándares de calidad. 
                  <br className="hidden sm:block" />
                  Somos cultivadores solidarios de nuestros pacientes. 
                  Utilizamos hidroponía y sustratos orgánicos sin pesticidas, disponiendo así de geneticas altas en THC y CBD.
                  <br className="hidden sm:block" />
                  Contamos con distintos tipos de membresía y las cuotas sociales se abonan del 1 al 5 de cada mes.
                  <br className="hidden sm:block" />
                  El retiro se realiza por nuestra sede en CABA.
                  <br className="hidden sm:block" />
                  Nuestro objetivo principal es brindar una alternativa confiable y profesional para aquellos que buscan mejorar su calidad de vida a través del cannabis medicinal.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-black p-4 sm:p-8 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700/50 group-hover:border-amber-500/30 transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">Nuestro Compromiso</h3>
                <p className={`text-gray-300 text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-4 ${tajawal.className}`}>
                  Nos dedicamos a proporcionar cannabis medicinal de la más alta calidad, cultivado con técnicas avanzadas y cuidados específicos.
                  <br className="hidden sm:block" />
                  Nuestro equipo está comprometido con el bienestar de nuestros pacientes, ofreciendo asesoramiento personalizado y seguimiento continuo.
                  <br className="hidden sm:block" />
                  Trabajamos en constante actualización con las últimas investigaciones y avances en el campo del cannabis medicinal.
                  <br className="hidden sm:block" />
                  Garantizamos la trazabilidad y calidad de nuestros productos, cumpliendo con todas las normativas vigentes.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
} 