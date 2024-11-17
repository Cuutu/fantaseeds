'use client';
import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiUserPlus, 
  FiAward, 
  FiActivity 
} from 'react-icons/fi';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    membershipDistribution: {
      '10G': 0,
      '20G': 0,
      '30G': 0
    },
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg text-gray-300">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-100">{stats.totalUsers}</p>
            </div>
            <FiUsers className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Membresía 10G</p>
              <p className="text-2xl font-bold text-gray-100">{stats.membershipDistribution['10G']}</p>
            </div>
            <FiAward className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Membresía 20G</p>
              <p className="text-2xl font-bold text-gray-100">{stats.membershipDistribution['20G']}</p>
            </div>
            <FiAward className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Membresía 30G</p>
              <p className="text-2xl font-bold text-gray-100">{stats.membershipDistribution['30G']}</p>
            </div>
            <FiAward className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabla de usuarios recientes */}
      <div className="bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">Usuarios Recientes</h2>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Membresía
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stats.recentUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.nombreApellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.membresia}
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