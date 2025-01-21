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
    if (window.confirm('¿Estás seguro de que quieres resetear la contraseña de este usuario?')) {
      try {
        const response = await fetch(`/api/users/${userId}/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success) {
          alert(`Contraseña reseteada. Nueva contraseña: ${data.newPassword}`);
        } else {
          throw new Error(data.error || 'Error al resetear la contraseña');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al resetear la contraseña');
      }
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
              <UserCard key={user._id} user={user} />
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
    </div>
  );
} 