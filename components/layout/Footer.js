import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Image
            src="https://imgur.com/7juFbF1.png"
            alt="Fantaseeds Logo"
            width={200}
            height={80}
            className="w-auto h-16 mb-4 md:mb-0"
          />
          <p className="text-gray-400 text-sm">
            © 2024 Fantaseeds. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 