'use client';
import { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import AlertModal from '@/components/ui/AlertModal';

export default function Perfil() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({
    nombreApellido: '',
    email: '',
    calle: '',
    numero: '',
    localidad: '',
    codigoPostal: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/get-profile');
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
          setFormData({
            ...formData,
            calle: data.user.domicilio?.calle || '',
            numero: data.user.domicilio?.numero || '',
            localidad: data.user.domicilio?.ciudad || '',
            codigoPostal: data.user.domicilio?.codigoPostal || ''
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (formData.get('newPassword') !== formData.get('confirmPassword')) {
      setAlertMessage('Las contraseñas no coinciden');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.get('currentPassword'),
          newPassword: formData.get('newPassword'),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAlertMessage('Contraseña actualizada correctamente. Se cerrará su sesión para aplicar los cambios.');
        setAlertType('success');
        setShowPasswordModal(false);
        e.target.reset();
        
        setTimeout(async () => {
          await signOut({ callbackUrl: '/login' });
        }, 2000);
      } else {
        setAlertMessage(data.error || 'Error al actualizar la contraseña');
        setAlertType('error');
      }
      setShowAlert(true);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error al actualizar la contraseña');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const response = await fetch('/api/users/update-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calle: formData.calle,
          numero: formData.numero,
          codigoPostal: formData.codigoPostal,
          localidad: formData.localidad
        }),
      });

      const data = await response.json();

      if (data.success) {
        await update({
          ...session,
          user: {
            ...session.user,
            domicilio: {
              calle: formData.calle,
              numero: formData.numero,
              codigoPostal: formData.codigoPostal,
              ciudad: formData.localidad
            }
          }
        });
        
        setAlertMessage('Domicilio actualizado correctamente');
        setAlertType('success');
        setIsEditing(false);
        
        window.location.reload();
      } else {
        throw new Error(data.error || 'Error al actualizar el domicilio');
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error al actualizar el domicilio');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const getFullAddress = () => {
    const domicilio = session?.user?.domicilio;
    if (!domicilio) return 'No especificado';
    
    const parts = [
      domicilio.calle,
      domicilio.numero,
      domicilio.ciudad,
      domicilio.codigoPostal
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(' ') : 'No especificado';
  };

  if (!session) {
    return <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <p className="text-white">Cargando...</p>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Información Personal</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200 flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Cambiar Contraseña
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200 flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Nombre y Apellido</p>
              <p className="text-white text-lg">{session?.user?.nombreApellido}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Usuario</p>
              <p className="text-white text-lg">{session?.user?.usuario}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white text-lg">{session?.user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Membresía</p>
              <p className="text-white text-lg">{session?.user?.membresia}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Fecha de Alta</p>
              <p className="text-white text-lg">
                {new Date(session?.user?.fechaAlta).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Domicilio</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>
          </div>

          {!isEditing && (
            <div>
              <p className="text-gray-400 text-sm mb-1">Dirección</p>
              <p className="text-white text-lg">
                {userData?.domicilio?.calle ? (
                  <>
                    {userData.domicilio.calle} {userData.domicilio.numero}
                    {userData.domicilio.ciudad && `, ${userData.domicilio.ciudad}`}
                    {userData.domicilio.codigoPostal && ` (${userData.domicilio.codigoPostal})`}
                  </>
                ) : (
                  'No especificada'
                )}
              </p>
            </div>
          )}

          {isEditing && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Calle</p>
                <input
                  type="text"
                  value={formData.calle}
                  onChange={(e) => setFormData({...formData, calle: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Ingresa tu calle"
                />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Número</p>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Ingresa el número"
                />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Localidad</p>
                <input
                  type="text"
                  value={formData.localidad}
                  onChange={(e) => setFormData({...formData, localidad: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Ingresa tu localidad"
                />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Código Postal</p>
                <input
                  type="text"
                  value={formData.codigoPostal}
                  onChange={(e) => setFormData({...formData, codigoPostal: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Ingresa el código postal"
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Cambiar Contraseña</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertModal 
        isOpen={showAlert}
        message={alertMessage}
        type={alertType}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
} 