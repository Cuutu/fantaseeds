'use client';
import { useState, useEffect } from 'react';

export default function AdminMultimediaPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        const videoSetting = data.settings.find(s => s.key === 'youtube_video_url');
        if (videoSetting) setVideoUrl(videoSetting.value);
      }
    } catch (e) {
      setError('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'youtube_video_url', value: videoUrl })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError('Error al guardar');
      }
    } catch (e) {
      setError('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Configuración Multimedia</h1>
      <form onSubmit={handleSave} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <div>
          <label className="block text-gray-300 mb-2">Link de YouTube</label>
          <input
            type="text"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        {success && <p className="text-green-400 mt-2">¡Guardado correctamente!</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
    </div>
  );
} 