'use client';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function LawInfo() {
  return (
    <section id="law" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-bold text-center mb-12 text-green-400">
            Ley 27.350
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal delay={200}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Marco Legal
              </h3>
              <p className="text-gray-300 leading-relaxed">
                La Ley 27.350 establece el marco regulatorio para la investigación médica 
                y científica del uso medicinal de la planta de cannabis y sus derivados.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Derechos Garantizados
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">•</span>
                  Acceso al tratamiento
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">•</span>
                  Protección legal
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">•</span>
                  Cultivo personal
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">•</span>
                  Asesoramiento médico
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
} 