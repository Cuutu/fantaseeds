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
          <h2 className={`text-5xl font-bold text-center mb-16 text-[#CDA500] ${ebGaramond.className}`}>
            REPROCANN
          </h2>
        </ScrollReveal>

        <div className="flex justify-center">
          <ScrollReveal delay={200}>
            <div className="relative group max-w-2xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-black p-8 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700/50 group-hover:border-amber-500/30 transition-colors duration-300">
                <h3 className="text-2xl font-semibold mb-6 text-white">¿Qué es el REPROCANN?</h3>
                <p className={`text-gray-300 text-lg leading-relaxed ${tajawal.className}`}>
                  El REPROCANN (Registro del Programa de Cannabis) es una herramienta del Ministerio de Salud de Argentina que permite a pacientes, médicos y cultivadores acceder al cannabis medicinal de manera legal y regulada. Este registro garantiza el uso responsable del cannabis para fines terapéuticos, brindando un marco seguro y transparente tanto para el cultivo como para el acceso a los derivados medicinales.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
} 