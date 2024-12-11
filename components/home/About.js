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
                  Somos una Organización No Gubernamental (ONG) comprometida con la salud y el bienestar de nuestra comunidad, especializada en el cultivo responsable de cannabis medicinal. Desde nuestros inicios, hemos trabajado bajo un marco legal y profesional, respaldados por la normativa vigente del REPROCANN, para ofrecer soluciones confiables y personalizadas a quienes buscan mejorar su calidad de vida a través de la medicina natural.
                  <br className="hidden sm:block" />
                  Nuestra misión es ser un puente entre el conocimiento, la experiencia y el acceso seguro al cannabis medicinal. Nos enfocamos en brindar un servicio integral que incluye el cultivo, cuidado, y entrega de productos de alta calidad, asegurando siempre la trazabilidad y transparencia en cada etapa del proceso.
                  <br className="hidden sm:block" />
                  En Fantaseeds creemos en el poder transformador de la educación y el acompañamiento. Por ello, no solo cultivamos plantas, sino también confianza y tranquilidad, guiando a nuestros socios en cada paso del camino. Nuestro compromiso con la excelencia y la ética nos posiciona como una referencia en el sector, garantizando un servicio que respalda tanto la salud como los valores que promovemos.
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
                  En Fantaseeds, nos comprometemos a garantizar un servicio de excelencia, cuidando cada etapa del proceso de cultivo para entregar productos seguros y de alta calidad. Trabajamos con ética, transparencia y dedicación, respetando siempre el marco legal del REPROCANN.
                  <br className="hidden sm:block" />
                  Nuestra prioridad es el bienestar de quienes confían en nosotros, ofreciendo soluciones confiables que marcan la diferencia en su calidad de vida.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
} 