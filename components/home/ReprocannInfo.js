'use client';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function ReprocannInfo() {
  return (
    <section id="reprocann" className="py-20" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            REPROCANN
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          <ScrollReveal delay={200}>
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-white">¿Qué es el REPROCANN?</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                El Registro del Programa de Cannabis (REPROCANN) es el sistema que permite 
                el acceso legal al cultivo controlado de la planta de cannabis con fines 
                medicinales.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-white">Requisitos para inscribirse</h3>
              <ul className="space-y-4 text-gray-300 text-lg">
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
} 