'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-gray-800 text-gray-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4">
        <span className="text-2xl font-extrabold text-green-500">FANTASEEDS.</span>
      </div>

      <nav className="space-y-2">
        <Link
          href="/admin"
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            pathname === '/admin'
              ? 'bg-gray-700 text-green-500'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>Dashboard</span>
          </div>
        </Link>

        <Link
          href="/admin/usuarios"
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            pathname === '/admin/usuarios'
              ? 'bg-gray-700 text-green-500'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>Usuarios</span>
          </div>
        </Link>

        <Link
          href="/admin/geneticas"
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            pathname === '/admin/geneticas'
              ? 'bg-gray-700 text-green-500'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>Genéticas</span>
          </div>
        </Link>
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-2 py-2.5 px-4 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition duration-200"
        >
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 