export interface Usuario {
  id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario: 'CLIENTE' | 'ADMIN';
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateUsuarioDto {
  email: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario?: 'CLIENTE' | 'ADMIN';
}

export interface UpdateUsuarioDto {
  email?: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario?: 'CLIENTE' | 'ADMIN';
}

export interface TipoUsuario {
  id: number;
  nombre: string;
  descripcion?: string;
}
