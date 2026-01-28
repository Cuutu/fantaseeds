import Image from 'next/image';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo a la izquierda */}
          <div className="flex-shrink-0">
            <Image
              src="/images/fanta-logo-chico.png"
              alt="FANTASEEDS"
              width={150}
              height={45}
              className="w-auto h-auto"
              priority
            />
          </div>
          
          {/* Crédito L40S en el medio */}
          <div className="flex-1 flex justify-center">
            <p className="text-gray-400 text-sm text-center">
              Desarrollado por{' '}
              <a
                href="https://l40s.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors font-medium"
              >
                L40S dev studio
              </a>
            </p>
          </div>
          
          {/* Contenido a la derecha */}
          <div className="flex flex-col items-center space-y-4 flex-shrink-0">
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.instagram.com/fantaseedss.ong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaInstagram className="text-3xl" />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=5491153325799&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="text-3xl" />
              </a>
            </div>

            <p className="text-gray-400 text-sm text-center">
              © 2024 Fantaseeds. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 