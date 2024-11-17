function LawInfo() {
  return (
    <section id="law" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-400">
          Ley 27.350 - Cannabis Medicinal
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-duration-300">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Objetivo de la Ley
            </h3>
            <p className="text-gray-300">
              Establecer un marco regulatorio para la investigación médica y científica 
              del uso medicinal de la planta de cannabis y sus derivados.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-duration-300">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Alcance
            </h3>
            <p className="text-gray-300">
              Garantiza el acceso gratuito al aceite de cannabis y demás derivados 
              a toda persona que se incorpore al programa nacional.
            </p>
          </div>
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
        </div>
      </div>
    </section>
  );
}

export default LawInfo; 