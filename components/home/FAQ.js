'use client';
import { useState } from 'react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { EB_Garamond } from 'next/font/google';

const ebGaramond = EB_Garamond({ subsets: ['latin'] });

function FAQ() {
  const [openStates, setOpenStates] = useState({});

  const faqs = [
    {
      question: "¿QUÉ SERVICIOS OFRECE FANTASEEDS?",
      answer: "Fantaseeds ofrece un servicio integral de cultivo de cannabis medicinal. Nos encargamos de todo el proceso, desde la semilla hasta la entrega, asegurando calidad, legalidad y transparencia."
    },
    {
      question: "¿QUIÉNES PUEDEN ACCEDER AL SERVICIO?",
      answer:" Nuestro servicio está destinado a personas, ONGs o fundaciones registradas en el REPROCANN que buscan una alternativa segura y profesional para obtener cannabis medicinal."
    },
    {
      question: "¿QUÉ GARANTIZA EL SERVICIO DE FANTASEEDS?",
      answer: "Garantizamos el acceso seguro a flores de cannabis medicinal, cuidando cada etapa del proceso para asegurar calidad, trazabilidad y cumplimiento legal."
    },
    {
      question: "¿EL CULTIVO ES LEGAL?",
      answer: "Sí, operamos bajo el marco legal de la Ley 27.350 y el REPROCANN, cumpliendo con todas las normativas del Ministerio de Salud de Argentina."
    },
    {
      question: "¿CÓMO RECIBO MI PRODUCCIÓN",
      answer: "Recibís tu producción todos los meses, en membresías que van de 10 a 40 gramos por persona. Podés retirarla en nuestra sede social o solicitar un envío a domicilio. Trabajamos en todo el país para garantizar que tu acceso sea seguro y conveniente."
    },
    {
      question: "¿ES NECESARIO ESTAR REGISTRADO EN EL REPROCANN?",
      answer: "Si no contás con el registro, nosotros gestionamos el trámite del REPROCANN para que puedas afiliarte y acceder a nuestro servicio de forma legal y segura."
    },
    {
      question: "¿QUE SUCEDE SI ALGO AFECTA MI CULTIVO?",
      answer: "En caso de imprevistos, garantizamos que recibirás la cantidad acordada de tu producción."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="faq" className="py-12 sm:py-16" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className={`text-3xl sm:text-5xl font-bold text-center mb-8 sm:mb-16 text-[#CDA500] ${ebGaramond.className}`}>
            PREGUNTAS FRECUENTES (FAQ)
          </h2>
        </ScrollReveal>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col space-y-0">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="border-t border-gray-700">
                  <button
                    className="w-full text-left flex justify-between items-center py-4 sm:py-6"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="text-base sm:text-xl font-medium text-gray-300 uppercase pr-4">
                      {faq.question}
                    </h3>
                    <span className="ml-2 sm:ml-4 text-xl sm:text-2xl text-gray-400 flex-shrink-0">
                      {openStates[index] ? '−' : '+'}
                    </span>
                  </button>
                  {openStates[index] && (
                    <div className={`pb-4 sm:pb-6 text-sm sm:text-base text-gray-400 leading-relaxed ${ebGaramond.className}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
            <div className="border-t border-gray-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ; 