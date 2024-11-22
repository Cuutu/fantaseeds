'use client';
import { useState } from 'react';
import ScrollReveal from '@/components/animations/ScrollReveal';

function FAQ() {
  const [openStates, setOpenStates] = useState({});

  const faqs = [
    {
      question: "¿CÓMO FUNCIONA EL CLUB?",
      answer: (
        <div className="space-y-4">
          <p>
            Somos una asociación civil. Al ser un club de cultivo solidario, nuestra misión es sumar a nuestra 
            asociación a aquellas personas a las cuales se les indique como modalidad terapéutica, medicinal o 
            paliativa del dolor, el uso de la planta de Cannabis y sus derivados, conforme la normativa vigente.
          </p>
          <p>
            Es por ello que no comercializamos cannabis ni exigimos una cuota mensual. La inscripción al club 
            es totalmente gratuita, sólo debes contar con el certificado REPROCANN vigente.
          </p>
        </div>
      )
    },
    {
      question: "¿QUÉ ES EL REPROCANN?",
      answer: (
        <div className="space-y-4">
          <p>
            El REPROCANN (Registro del Programa de Cannabis) es una base de datos diseñada para poder registrar 
            a aquellas personas que cuenten con las condiciones para acceder a un cultivo controlado de la planta 
            de cannabis, con fines de tratamiento medicinal, terapéutico y/o paliativo del dolor. La inscripción 
            concluye con la extensión de un certificado de cultivo autorizado por el Ministerio de Salud de la Nación.
          </p>
          <p>
            Los datos suministrados revisten carácter de Declaración Jurada y están protegidos por la normativa 
            vigente y en ningún caso se revela información relativa a la identidad, salvo por resolución judicial 
            debidamente fundada.
          </p>
          <p>
            El trámite de inscripción no posee costo alguno por parte del Ministerio de Salud de la Nación. 
            El tiempo de vigencia de la autorización es de un año. Una vez vencida la autorización debe realizar 
            nuevamente el trámite. No hay renovación automática.
          </p>
        </div>
      )
    },
    {
      question: "¿QUÉ PASA SI NO TENGO EL REPROCANN?",
      answer: "En caso de que aún no estés inscripto como paciente con indicación médica, te proveeremos el contacto de un especialista de confianza de nuestra fundación que te ayudará con el proceso para que obtengas tu certificado REPROCANN."
    },
    {
      question: "¿CÓMO ES LA CALIDAD DE PRODUCCIÓN?",
      answer: "Estamos asesorados desde los mejores cannacultores de California, por lo que nuestra producción está verificada por un laboratorio para que sean de una calidad farmacéutica válida."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="faq" className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent">
            Preguntas Frecuentes (FAQ)
          </h2>
        </ScrollReveal>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col space-y-0">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="border-t border-gray-700">
                  <button
                    className="w-full text-left flex justify-between items-center py-6"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="text-xl font-medium text-gray-300 uppercase">
                      {faq.question}
                    </h3>
                    <span className="ml-4 text-2xl text-gray-400">
                      {openStates[index] ? '−' : '+'}
                    </span>
                  </button>
                  {openStates[index] && (
                    <div className="pb-6 text-gray-400 leading-relaxed">
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