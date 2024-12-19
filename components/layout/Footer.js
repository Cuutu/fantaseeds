import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex justify-center">
            <Image
              src="/images/fanta-logo-chico.png"
              alt="FANTASEEDS"
              width={150}
              height={45}
              className="w-auto h-auto"
              priority
            />
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Fantaseeds. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 