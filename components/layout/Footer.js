function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Club Cannábico</h3>
            <p className="text-sm">
              Promoviendo el acceso seguro y legal al cannabis medicinal.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-green-300">Sobre Nosotros</a></li>
              <li><a href="#reprocann" className="hover:text-green-300">REPROCANN</a></li>
              <li><a href="#law" className="hover:text-green-300">Ley 27350</a></li>
              <li><a href="#contact" className="hover:text-green-300">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@clubcannabico.com</li>
              <li>Teléfono: (123) 456-7890</li>
              <li>Horario: Lun-Vie 9:00-18:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Club Cannábico. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 