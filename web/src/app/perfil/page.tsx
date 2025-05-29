'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { User, Shield, Mail, Calendar, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import EditProfileModal from '@/components/auth/EditProfileModal';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import { usuariosService } from '@/services/usuarios.service';
import { authService } from '@/services/auth.service';
import { UpdateUsuarioDto } from '@/types/usuarios';
import Layout from '@/components/layout/Layout';

const ProfilePage: React.FC = () => {
  const { usuario, isAuthenticated, cerrarSesion, actualizarUsuario, isLoading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  // Manejar actualización de perfil
  const handleUpdateProfile = async (datos: UpdateUsuarioDto) => {
    try {
      if (!usuario?.id) return;
      
      const response = await usuariosService.actualizarPerfil(datos);
      
      // Actualizar el usuario en el contexto
      actualizarUsuario(response.data);
      
      showNotification('success', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      showNotification('error', 'Error al actualizar el perfil');
      throw error;
    }
  };
  // Manejar cambio de contraseña
  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      await authService.cambiarContrasena(currentPassword, newPassword, confirmPassword);
      showNotification('success', 'Contraseña cambiada correctamente');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      showNotification('error', 'Error al cambiar la contraseña');
      throw error;
    }
  };  // Mostrar loading durante la verificación inicial
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Verificando sesión...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu autenticación
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !usuario) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <User className="h-16 w-16 text-[#CC9F53] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder a tu perfil
            </p>
            <Button onClick={() => window.history.back()}>
              Volver
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      // Redirigir a home después del logout
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
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
          )}          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-[#CC9F53] p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full text-2xl font-bold text-white">
                  {usuario.nombres?.charAt(0)?.toUpperCase() || 'U'}
                  {usuario.apellidos?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {usuario.nombres} {usuario.apellidos}
                  </h1>
                  <p className="text-white text-lg">{usuario.email}</p>
                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 mr-2 text-white" />
                    <span className="text-sm text-white">
                      {usuario.tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Administrador'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Información Personal
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                  <Mail className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm text-neutral-600">Correo Electrónico</p>
                    <p className="font-medium text-neutral-900">{usuario.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                  <User className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm text-neutral-600">Nombres</p>
                    <p className="font-medium text-neutral-900">{usuario.nombres || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                  <User className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm text-neutral-600">Apellidos</p>
                    <p className="font-medium text-neutral-900">{usuario.apellidos || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                  <Phone className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm text-neutral-600">Celular</p>
                    <p className="font-medium text-neutral-900">{usuario.celular || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-600 mr-3" />                  <div>
                    <p className="text-sm text-neutral-600">Tipo de Usuario</p>
                    <p className="font-medium text-neutral-900">
                      {usuario.tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Administrador'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary-600" />
                Acciones de Cuenta
              </h2>
              
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {/* Implementar historial */}}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Historial de Pedidos
                </Button>
                
                <div className="pt-4 border-t border-neutral-200">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Modals */}
          <EditProfileModal
            usuario={usuario}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateProfile}
          />

          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onSave={handleChangePassword}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
