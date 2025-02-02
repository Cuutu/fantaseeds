'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserModal from '@/components/admin/UserModal';
import EditUserModal from '@/components/admin/EditUserModal';
import DeleteUserModal from '@/components/admin/DeleteUserModal';
import { FiSearch, FiUserPlus } from 'react-icons/fi';

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.usuario.toLowerCase().includes(searchTermLower) ||
        user.nombreApellido.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar usuarios');
      }

      if (data.success) {
        setUsers(data.users);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers(); // Actualizar la lista
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      } else {
        throw new Error(data.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    setSelectedUserId(userId);
    setShowConfirmModal(true);
  };

  const confirmResetPassword = async () => {
    try {
      const response = await fetch(`/api/users/${selectedUserId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setNewPassword(data.newPassword);
        setModalMessage('Contraseña reseteada exitosamente');
        setModalType('success');
      } else {
        setModalMessage(data.error || 'Error al resetear la contraseña');
        setModalType('error');
      }
      
      setShowConfirmModal(false);
      setShowResultModal(true);
    } catch (error) {
      setModalMessage('Error al resetear la contraseña');
      setModalType('error');
      setShowConfirmModal(false);
      setShowResultModal(true);
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400">Usuario</p>
          <p className="text-gray-300">{user.usuario}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Nombre y Apellido</p>
          <p className="text-gray-300">{user.nombreApellido}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Email</p>
          <p className="text-gray-300">{user.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Dirección</p>
          {user.domicilio?.calle ? (
            <button
              onClick={() => {
                setSelectedAddress(user.domicilio);
                setShowAddressModal(true);
              }}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Ver dirección
            </button>
          ) : (
            <p className="text-gray-300">No especificada</p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-400">Membresía</p>
          <p className="text-gray-300">{user.membresia}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => {
              setSelectedUser(user);
              setIsEditModalOpen(true);
            }}
            className="flex-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 py-2 rounded-lg transition-colors"
          >
            Editar
          </button>
          <button 
            onClick={() => {
              setSelectedUser(user);
              setIsDeleteModalOpen(true);
            }}
            className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 md:pl-8">
      <div className="max-w-6xl mt-8">
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-white">Usuarios</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200"
            >
              <FiUserPlus className="h-5 w-5" />
              Agregar Usuario
            </button>
          </div>

          <div className="relative max-w-2xl w-full">
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o email..."
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Vista móvil */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="bg-gray-800 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-400">Usuario: <span className="text-white">{user.usuario}</span></p>
                  <p className="text-gray-400">Nombre: <span className="text-white">{user.nombreApellido}</span></p>
                  <p className="text-gray-400">Email: <span className="text-white">{user.email}</span></p>
                  <p className="text-gray-400">Dirección: 
                    <span className="text-white">
                      {user.domicilio?.calle ? 'Dirección registrada' : 'No especificada'}
                    </span>
                  </p>
                  <p className="text-gray-400">Membresía: <span className="text-white">{user.membresia}</span></p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 py-2 rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-lg transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </div>
          )}
        </div>

        {/* Vista desktop */}
        <div className="hidden lg:block bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nombre y Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Membresía
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.usuario}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.nombreApellido}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {user.domicilio?.calle ? (
                          <button
                            onClick={() => {
                              setSelectedAddress(user.domicilio);
                              setShowAddressModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Ver dirección registrada
                          </button>
                        ) : (
                          <p className="text-gray-300">No especificada</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.membresia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleResetPassword(user._id)}
                          className="text-yellow-400 hover:text-yellow-300 mr-4"
                        >
                          Resetear Contraseña
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onUserCreated={fetchUsers}
      />

      {selectedUser && (
        <>
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onUserUpdated={fetchUsers}
            user={selectedUser}
          />

          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleDeleteUser}
            user={selectedUser}
            loading={loading}
          />
        </>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Reseteo de Contraseña</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres resetear la contraseña de este usuario?
              Esta acción generará una nueva contraseña aleatoria.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmResetPassword}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              {modalType === 'success' ? (
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-4">{modalMessage}</h3>
            {modalType === 'success' && (
              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <p className="text-gray-300 text-center mb-2">Nueva contraseña:</p>
                <p className="text-green-500 text-xl text-center font-mono">{newPassword}</p>
                <p className="text-gray-300 text-center mt-2 text-sm">
                  Se ha enviado un email al usuario con la nueva contraseña
                </p>
              </div>
            )}
            <div className="flex justify-center">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddressModal && selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Dirección Completa</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Calle</p>
                <p className="text-white">{selectedAddress.calle}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Número</p>
                <p className="text-white">{selectedAddress.numero}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Localidad</p>
                <p className="text-white">{selectedAddress.ciudad || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Código Postal</p>
                <p className="text-white">{selectedAddress.codigoPostal || 'No especificado'}</p>
              </div>
              {selectedAddress.provincia && (
                <div>
                  <p className="text-gray-400 text-sm">Provincia</p>
                  <p className="text-white">{selectedAddress.provincia}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 