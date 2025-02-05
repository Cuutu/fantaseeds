import Image from 'next/image';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="mb-4 md:mb-0">
            <Image
              src="/images/fanta-logo-chico.png"
              alt="FANTASEEDS"
              width={150}
              height={45}
              className="w-auto h-auto"
              priority
            />
          </div>
          
          {/* Contenido a la derecha */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/fantaseedss.ong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaInstagram className="text-3xl" />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=5491127064165&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="text-3xl" />
              </a>
            </div>

            <p className="text-gray-400 text-sm">
              © 2024 Fantaseeds. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 