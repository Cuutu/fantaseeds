function ReprocannInfo() {
  return (
    <section id="reprocann" className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-400">
          REPROCANN
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">¿Qué es REPROCANN?</h3>
              <p className="text-gray-300">
                El Registro del Programa de Cannabis (REPROCANN) es el sistema que permite 
                el registro de usuarios que cultivan cannabis para fines medicinales.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">Beneficios</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Cultivo legal de cannabis
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Acceso seguro a la medicina
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Asesoramiento profesional
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Protección legal
                </li>
              </ul>
            </div>
          </div>
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
        </div>
      </div>
    </section>
  );
}

export default ReprocannInfo; 