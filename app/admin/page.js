'use client';
import { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    membresias: {
      '10G': 0,
      '20G': 0,
      '30G': 0
    },
    ultimosUsuarios: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-white mt-8 mb-12">Dashboard</h1>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Usuarios */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Usuarios</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsuarios}</p>
            </div>
            <FiUsers className="text-green-500 text-2xl" />
          </div>
        </div>

        {/* Membresías */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Membresía 10G</p>
          <p className="text-2xl font-bold text-white">{stats.membresias['10G']}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Membresía 20G</p>
          <p className="text-2xl font-bold text-white">{stats.membresias['20G']}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Membresía 30G</p>
          <p className="text-2xl font-bold text-white">{stats.membresias['30G']}</p>
        </div>
      </div>

      {/* Últimos Usuarios */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Últimos Usuarios Registrados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-4">Nombre</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Membresía</th>
                <th className="pb-4">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {stats.ultimosUsuarios.map((usuario, index) => (
                <tr key={index} className="text-gray-300 border-t border-gray-700">
                  <td className="py-3">{usuario.nombreApellido}</td>
                  <td className="py-3">{usuario.email}</td>
                  <td className="py-3">{usuario.membresia}</td>
                  <td className="py-3">
                    {new Date(usuario.fechaAlta).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 