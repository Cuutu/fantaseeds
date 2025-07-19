import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo */}
          <div className="w-48">
            <Image
              src="/logo.png"
              alt="Fantaseeds"
              width={200}
              height={100}
              className="w-full h-auto"
            />
          </div>

          {/* Social Media Icons */}
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
              href="https://api.whatsapp.com/send/?phone=5491127415571&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              <FaWhatsapp className="text-3xl" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © 2024 Fantaseeds. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 