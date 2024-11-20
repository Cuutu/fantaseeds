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
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 mt-4">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-100">{stats.totalUsers}</p>
            </div>
            <FiUsers className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        {/* ... resto de las cards ... */}
      </div>
      
      {/* ... resto del contenido ... */}
    </div>
  );
} 