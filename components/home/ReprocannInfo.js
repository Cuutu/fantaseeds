'use client';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function ReprocannInfo() {
  return (
    <section id="reprocann" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-bold text-center mb-12 text-green-400">
            REPROCANN
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal delay={200}>
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">¿Qué es el REPROCANN?</h3>
              <p className="text-gray-300 leading-relaxed">
                El Registro del Programa de Cannabis (REPROCANN) es el sistema que permite 
                el acceso legal al cultivo controlado de la planta de cannabis con fines 
                medicinales.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">Requisitos para inscribirse</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Ser mayor de edad
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Presentar indicación médica
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Contar con diagnóstico de condición tratable con cannabis
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
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