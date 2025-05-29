import { 
  CreateUsuarioDto, 
  UpdateUsuarioDto, 
  Usuario 
} from '../types/usuarios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

class UsuariosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Obtener perfil del usuario autenticado
  async obtenerPerfil(): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }  }

  // Actualizar perfil del usuario autenticado
  async actualizarPerfil(datos: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios (solo admin)
  async obtenerTodos(): Promise<ApiResponse<Usuario[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener usuarios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtener un usuario específico
  async obtenerPorId(id: number): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Crear usuario (solo admin)
  async crear(datos: CreateUsuarioDto): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async actualizar(id: number, datos: UpdateUsuarioDto): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async eliminar(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export const usuariosService = new UsuariosService();
