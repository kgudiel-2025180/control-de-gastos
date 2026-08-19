export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** Error controlado de autenticación (credenciales inválidas, etc.). */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}