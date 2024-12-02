'use client';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { EB_Garamond } from 'next/font/google';
import { Tajawal } from 'next/font/google';

// Inicializar la fuente fuera del componente
const ebGaramond = EB_Garamond({ subsets: ['latin'] });
const tajawal = Tajawal({ 
  weight: ['400', '500', '700'],
  subsets: ['latin']
});

export default function ReprocannInfo() {
  return (
    <section id="reprocann" className="py-20" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className={`text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent ${ebGaramond.className}`}>
            REPROCANN
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          <ScrollReveal delay={200}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-black p-8 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700/50 group-hover:border-amber-500/30 transition-colors duration-300">
                <h3 className="text-2xl font-semibold mb-6 text-white">¿Qué es el REPROCANN?</h3>
                <p className={`text-gray-300 text-lg leading-relaxed ${tajawal.className}`}>
                  El Registro del Programa de Cannabis (REPROCANN) es el sistema que permite 
                  el acceso legal al cultivo controlado de la planta de cannabis con fines 
                  medicinales.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-25"></div>
              <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-10"></div>
              <div className="bg-black/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-amber-500/10 transition-all duration-300 border border-amber-500/30">
                <h3 className="text-2xl font-semibold mb-6 text-white">Requisitos para inscribirse</h3>
                <ul className={`space-y-4 text-gray-300 text-lg ${tajawal.className}`}>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                    Ser mayor de edad
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                    Presentar indicación médica
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                    Contar con diagnóstico de condición tratable con cannabis
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                    Completar el registro en la plataforma oficial
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
} 