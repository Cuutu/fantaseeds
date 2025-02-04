import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <ul className="space-y-4 text-xs sm:text-sm">
              <li>Email: info@fantaseeds.com</li>
              <li>
                <a 
                  href="https://www.instagram.com/fantaseedss.ong"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-300 transition-colors"
                >
                  <FaInstagram className="text-2xl" />
                  <span>@fantaseedss.ong</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://api.whatsapp.com/send/?phone=5491127064165&text&type=phone_number&app_absent=0"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-300 transition-colors"
                >
                  <FaWhatsapp className="text-2xl" />
                  <span>+54 9 11 2706-4165</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 