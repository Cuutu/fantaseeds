'use client';
import { useState, useEffect } from 'react';

export default function AdminMultimediaPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);

  // Detectar tipo de video
  const isShort = videoUrl.includes('/shorts/');
  const videoType = isShort ? 'YouTube Short (Vertical)' : 'Video Normal (Horizontal)';
  
  // Extraer ID del video de YouTube
  const getVideoId = (url) => {
    if (!url) return null;
    
    // Para URLs normales: youtube.com/watch?v=ID
    const normalMatch = url.match(/[?&]v=([^&#]*)/);
    if (normalMatch) return normalMatch[1];
    
    // Para shorts: youtube.com/shorts/ID
    const shortsMatch = url.match(/\/shorts\/([^?&#]*)/);
    if (shortsMatch) return shortsMatch[1];
    
    // Para URLs cortas: youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&#]*)/);
    if (shortMatch) return shortMatch[1];
    
    return null;
  };
  
  // Convertir URL para preview con parámetros adicionales
  const getPreviewUrl = (url) => {
    const videoId = getVideoId(url);
    if (!videoId) return '';
    
    // Parámetros para mejor compatibilidad (SIN autoplay en el preview)
    const params = new URLSearchParams({
      rel: '0',              // No mostrar videos relacionados
      modestbranding: '1',   // Menos branding de YouTube
      controls: '1',         // Mostrar controles
      showinfo: '0',         // No mostrar info del video
      fs: '1',               // Permitir pantalla completa
      cc_load_policy: '0',   // No cargar subtítulos automáticamente
      iv_load_policy: '3',   // No cargar anotaciones
      autoplay: '0'          // No reproducir automáticamente en preview
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Validar si la URL es de YouTube válida
  const isValidYouTubeUrl = (url) => {
    if (!url) return false;
    const videoId = getVideoId(url);
    return videoId && videoId.length >= 10; // Los IDs de YouTube típicamente tienen 11 caracteres
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setPreviewError(false);
  }, [videoUrl]);

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
    
    // Validar URL antes de guardar
    if (!isValidYouTubeUrl(videoUrl)) {
      setError('Por favor ingresa una URL válida de YouTube');
      setSaving(false);
      return;
    }
    
    try {
      console.log('Enviando:', { key: 'youtube_video_url', value: videoUrl });
      
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
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

  const handleIframeError = () => {
    setPreviewError(true);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <div className="text-white text-center">Cargando...</div>
      </div>
    );
  }

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
          <p className="text-xs text-gray-400 mb-2">
            Este video se mostrará en la página principal, se reproducirá automáticamente al 20% de volumen y al finalizar redirigirá a la página de Membresías.
          </p>
          
          {/* Validación en tiempo real */}
          {videoUrl && !isValidYouTubeUrl(videoUrl) && (
            <p className="text-red-400 text-sm mt-1">
              URL no válida. Debe ser una URL de YouTube válida.
            </p>
          )}
          
          {videoUrl && isValidYouTubeUrl(videoUrl) && (
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded text-xs ${
                isShort ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {videoType}
              </span>
              <span className="ml-2 text-xs text-gray-400">
                ID: {getVideoId(videoUrl)}
              </span>
            </div>
          )}
        </div>

        {/* Preview del video */}
        {videoUrl && isValidYouTubeUrl(videoUrl) && (
          <div className="mt-4">
            <label className="block text-gray-300 mb-2">Preview:</label>
            <div className="flex justify-center">
              <div className={`rounded-lg overflow-hidden border-2 border-gray-600 ${
                isShort 
                  ? 'aspect-[9/16] w-full max-w-[200px]' 
                  : 'aspect-[16/9] w-full max-w-[400px]'
              }`}>
                {previewError ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="text-center text-gray-400 p-4">
                      <p className="text-sm">Error al cargar el video</p>
                      <p className="text-xs mt-1">El video puede tener restricciones de inserción</p>
                      <button 
                        type="button"
                        onClick={() => setPreviewError(false)}
                        className="text-blue-400 text-xs mt-2 underline"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getPreviewUrl(videoUrl)}
                    title="Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                    onError={handleIframeError}
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                )}
              </div>
            </div>
            
            {/* Información adicional */}
            <div className="mt-2 text-xs text-gray-400 text-center space-y-1">
              {previewError ? (
                <span className="text-yellow-400">
                  ⚠️ Si el video no se muestra aquí, aún funcionará en la página principal
                </span>
              ) : (
                <span>
                  ✅ Preview cargado correctamente
                </span>
              )}
              <div className="text-blue-300 mt-2">
                <p>ℹ️ En la página principal el video:</p>
                <p>• Se reproduce automáticamente al 20% de volumen</p>
                <p>• Al terminar redirige a la página de Membresías</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          disabled={saving || !isValidYouTubeUrl(videoUrl)}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        
        {success && <p className="text-green-400 mt-2">¡Guardado correctamente!</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
    </div>
  );
} 