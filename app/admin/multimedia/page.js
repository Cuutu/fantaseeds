'use client';
import { useState, useEffect } from 'react';

export default function AdminMultimediaPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Detectar tipo de video
  const isShort = videoUrl.includes('/shorts/');
  const videoType = isShort ? 'YouTube Short (Vertical)' : 'Video Normal (Horizontal)';
  
  // Convertir URL para preview
  const getPreviewUrl = (url) => {
    if (!url) return '';
    let embedUrl = url;
    if (url.includes('watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('/shorts/')) {
      embedUrl = url.replace('/shorts/', '/embed/');
    }
    return embedUrl;
  };

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
      console.log('Enviando:', { key: 'youtube_video_url', value: videoUrl });
      
      const res = await fetch('/api/admin/settings', {
        method: 'POST', // Cambio de PUT a POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'youtube_video_url', value: videoUrl })
      });
      
      console.log('Respuesta status:', res.status);
      const data = await res.json();
      console.log('Respuesta data:', data);
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Error al guardar');
      }
    } catch (e) {
      console.error('Error catch:', e);
      setError('Error de conexión');
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
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 mb-2"
            placeholder="https://www.youtube.com/watch?v=... o https://www.youtube.com/shorts/..."
            required
          />
          {videoUrl && (
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded text-xs ${
                isShort ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {videoType}
              </span>
            </div>
          )}
        </div>

        {/* Preview del video */}
        {videoUrl && getPreviewUrl(videoUrl) && (
          <div className="mt-4">
            <label className="block text-gray-300 mb-2">Preview:</label>
            <div className="flex justify-center">
              <div className={`rounded-lg overflow-hidden border-2 border-gray-600 ${
                isShort 
                  ? 'aspect-[9/16] w-full max-w-[200px]' 
                  : 'aspect-[16/9] w-full max-w-[400px]'
              }`}>
                <iframe
                  width="100%"
                  height="100%"
                  src={getPreviewUrl(videoUrl)}
                  title="Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}

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