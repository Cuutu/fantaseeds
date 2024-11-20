import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        <Image
          src="https://imgur.com/7juFbF1.png"
          alt="Fantaseeds Logo"
          width={100}
          height={40}
          className="w-auto h-8"
        />
        <p className="text-gray-400 text-sm text-center">
          © 2024 Fantaseeds. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
} 