export interface Usuario {
  id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario: 'CLIENTE' | 'ADMIN';
  eliminado: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}
