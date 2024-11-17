'use client';
import { useState } from 'react';

export default function AdminSetup() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
      });
      const data = await response.json();
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Crear Administrador</h1>
      <button
        onClick={createAdmin}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creando...' : 'Crear Admin'}
      </button>
      {message && (
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {message}
        </pre>
      )}
    </div>
  );
} 