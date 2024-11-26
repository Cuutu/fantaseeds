'use client';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Roboto_Slab} from 'next/font/google';
import { Tajawal } from 'next/font/google';

// Inicializar las fuentes
const robotoSlab = Roboto_Slab({ subsets: ['latin'] });
const tajawal = Tajawal({ 
  weight: ['400', '500', '700'],
  subsets: ['latin']
});

export default function LawInfo() {
  return (
    <section id="law" className="py-20" style={{ backgroundColor: '#2D2D2D' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className={`text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent ${robotoSlab.className}`}>
            Ley 27.350
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          <ScrollReveal delay={200}>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-white">
                Marco Legal
              </h3>
              <p className={`text-gray-300 text-lg leading-relaxed ${tajawal.className}`}>
                La Ley 27350 establece el marco regulatorio para la investigación médica 
                y científica del uso medicinal de la planta de cannabis y sus derivados.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-white">
                Derechos Garantizados
              </h3>
              <ul className={`space-y-4 text-gray-300 text-lg ${tajawal.className}`}>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                  Acceso al tratamiento
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                  Protección legal
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                  Cultivo personal
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
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