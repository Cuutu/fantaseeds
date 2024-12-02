import { FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">FANTASEEDS</h3>
            <p className="text-sm">
              Tu club cannábico medicinal de confianza
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="#about" className="hover:text-green-300 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#reprocann" className="hover:text-green-300 transition-colors">REPROCANN</a></li>
              <li><a href="#law" className="hover:text-green-300 transition-colors">Ley 27350</a></li>
              <li><a href="#faq" className="hover:text-green-300 transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#contact" className="hover:text-green-300 transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Email: info@fantaseeds.com</li>
              <li className="flex items-center gap-2">
                <a 
                  href="https://www.instagram.com/fantaseeds.ong" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-300 transition-colors"
                >
                  <FaInstagram className="text-lg sm:text-xl" />
                  <span>@fantaseeds.ong</span>
                </a>
              </li>
              <li>WhatsApp: +54 (XX) XXXX-XXXX</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 