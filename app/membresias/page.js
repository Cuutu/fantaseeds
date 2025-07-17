'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiCheck, FiStar, FiArrowRight } from 'react-icons/fi';

export default function MembresiasPage() {
  const { data: session } = useSession();
  const [hoveredCard, setHoveredCard] = useState(null);

  const memberships = [
    {
      id: '10G',
      name: '10G',
      price: '$15.000',
      period: '/mes',
      description: 'Ideal para empezar',
      limit: '10 unidades por mes',
      features: [
        'Hasta 10 unidades mensuales',
        'Acceso a todas las genéticas',
        'Soporte básico',
        'Envíos a todo el país'
      ],
      popular: false,
      color: 'green'
    },
    {
      id: '20G',
      name: '20G',
      price: '$28.000',
      period: '/mes',
      description: 'La más popular',
      limit: '20 unidades por mes',
      features: [
        'Hasta 20 unidades mensuales',
        'Acceso a todas las genéticas',
        'Soporte prioritario',
        'Envíos gratis',
        'Descuentos especiales'
      ],
      popular: true,
      color: 'emerald'
    },
    {
      id: '30G',
      name: '30G',
      price: '$40.000',
      period: '/mes',
      description: 'Para usuarios frecuentes',
      limit: '30 unidades por mes',
      features: [
        'Hasta 30 unidades mensuales',
        'Acceso a todas las genéticas',
        'Soporte VIP',
        'Envíos gratis express',
        'Descuentos premium',
        'Acceso anticipado a nuevas genéticas'
      ],
      popular: false,
      color: 'teal'
    },
    {
      id: '40G',
      name: '40G',
      price: '$50.000',
      period: '/mes',
      description: 'Membresía premium',
      limit: '40 unidades por mes',
      features: [
        'Hasta 40 unidades mensuales',
        'Acceso a todas las genéticas',
        'Soporte VIP 24/7',
        'Envíos gratis express',
        'Descuentos máximos',
        'Acceso anticipado',
        'Asesoramiento personalizado',
        'Genéticas exclusivas'
      ],
      popular: false,
      color: 'cyan'
    }
  ];

  const getCardClasses = (membership) => {
    const baseClasses = "relative rounded-2xl border transition-all duration-300 transform hover:scale-105";
    
    if (membership.popular) {
      return `${baseClasses} border-emerald-500 bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 shadow-emerald-500/20 shadow-xl`;
    }
    
    return `${baseClasses} border-gray-700 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-gray-600`;
  };

  const handleUpgrade = (membershipId) => {
    // Abrir WhatsApp con mensaje personalizado
    const message = `Hola! Me interesa upgradear a la membresía ${membershipId}. ¿Podrían darme más información?`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5491127064165&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Nuestras <span className="text-emerald-400">Membresías</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elegí la membresía que mejor se adapte a tus necesidades. 
            Cada plan incluye acceso completo a nuestro catálogo de genéticas premium.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {memberships.map((membership) => (
            <div
              key={membership.id}
              className={getCardClasses(membership)}
              onMouseEnter={() => setHoveredCard(membership.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular Badge */}
              {membership.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <FiStar className="mr-1 h-4 w-4" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{membership.name}</h3>
                  <p className="text-gray-400 text-sm">{membership.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{membership.price}</span>
                    <span className="text-gray-400 ml-1">{membership.period}</span>
                  </div>
                  <p className="text-emerald-400 font-medium mt-2">{membership.limit}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {membership.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <FiCheck className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(membership.id)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group ${
                    membership.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white hover:text-emerald-400'
                  }`}
                >
                  Elegir Plan
                  <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800/50 rounded-2xl p-8 text-center border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">¿Necesitás ayuda para elegir?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Nuestro equipo está disponible para ayudarte a encontrar la membresía perfecta 
            según tus necesidades y consumo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://api.whatsapp.com/send/?phone=5491127064165&text=Hola!%20Me%20gustar%C3%ADa%20recibir%20asesoramiento%20sobre%20las%20membres%C3%ADas&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              Contactar por WhatsApp
            </a>
            {!session && (
              <Link
                href="/login"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Preguntas Frecuentes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">¿Puedo cambiar mi membresía?</h4>
              <p className="text-gray-300">
                Sí, podés upgradear o downgrade tu membresía en cualquier momento contactándonos por WhatsApp.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">¿Qué pasa si no uso toda mi cuota?</h4>
              <p className="text-gray-300">
                Las unidades no utilizadas no se acumulan. Cada mes comenzás con tu cuota completa.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">¿Hay descuentos por pago anual?</h4>
              <p className="text-gray-300">
                Sí, ofrecemos descuentos especiales para pagos anuales. Consultanos por WhatsApp.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">¿Puedo cancelar en cualquier momento?</h4>
              <p className="text-gray-300">
                Por supuesto, no hay compromisos a largo plazo. Podés cancelar cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 