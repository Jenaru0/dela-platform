'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Phone, 
  Search,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { usuariosService } from '@/services/usuarios.service';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '@/types/usuarios';
import CreateUserModal from '@/components/auth/CreateUserModal';
import EditUserModal from '@/components/auth/EditUserModal';
import Layout from '@/components/layout/Layout';

const UserManagementPage: React.FC = () => {
  const { usuario: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);  // Verificar si el usuario es administrador
  const isAdmin = currentUser?.tipoUsuario === 'ADMIN';

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await usuariosService.obtenerTodos();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showNotification('error', 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadUsers();
    }
  }, [isAuthenticated, isAdmin, loadUsers]);

  // Crear usuario
  const handleCreateUser = async (userData: CreateUsuarioDto) => {
    try {
      await usuariosService.crear(userData);
      showNotification('success', 'Usuario creado correctamente');
      loadUsers();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      showNotification('error', 'Error al crear usuario');
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async (userId: number, userData: UpdateUsuarioDto) => {
    try {
      await usuariosService.actualizar(userId, userData);
      showNotification('success', 'Usuario actualizado correctamente');
      loadUsers();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      showNotification('error', 'Error al actualizar usuario');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await usuariosService.eliminar(userId);
      showNotification('success', 'Usuario eliminado correctamente');
      loadUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showNotification('error', 'Error al eliminar usuario');
    }
  };
  // Filtrar usuarios
  const filteredUsers = usuarios.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mostrar loading durante la verificación inicial
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Verificando permisos...
            </h2>
            <p className="text-neutral-600">
              Por favor espera mientras verificamos tu acceso
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-neutral-600 mb-6">
              Solo los administradores pueden acceder a esta página
            </p>
            <Button onClick={() => window.history.back()}>
              Volver
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Notification */}
          {notification && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                {notification.message}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    Gestión de Usuarios
                  </h1>
                  <p className="text-neutral-600">
                    Administra todos los usuarios del sistema
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar usuarios por email, nombres o apellidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-neutral-600">Cargando usuarios...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No se encontraron usuarios</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                        Contacto
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                        Fecha Registro
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full text-primary-600 font-semibold mr-3">
                              {user.nombres?.charAt(0)?.toUpperCase() || 'U'}
                              {user.apellidos?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">
                                {user.nombres} {user.apellidos}
                              </p>
                              <p className="text-sm text-neutral-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-neutral-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {user.email}
                            </div>
                            {user.celular && (
                              <div className="flex items-center text-sm text-neutral-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {user.celular}
                              </div>
                            )}                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.tipoUsuario === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Admin'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {user.fechaCreacion 
                            ? new Date(user.fechaCreacion).toLocaleDateString('es-ES')
                            : 'No disponible'
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modals */}
          <CreateUserModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateUser}
          />

          <EditUserModal
            usuario={selectedUser}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateUser}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserManagementPage;
