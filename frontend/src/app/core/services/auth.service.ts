import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../api';
import { AuthError, LoginRequest, LoginResponse, AuthUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionKey = 'cdg.session';
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  readonly authenticated = signal(false);
  readonly sessionExpired = signal(false);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      })
      .pipe(
      map((response) => {
        this.persistSession(response);
        this.authenticated.set(true);
        this.sessionExpired.set(false);
        this.scheduleExpiryFromToken(response.token);
        return response;
      }), 
        catchError((err: HttpErrorResponse) => {
          const msg =
            err.status === 401
              ? 'Correo o contrasena incorrectos. Verifica tus credenciales.'
              : 'No se pudo iniciar sesion. Intentalo de nuevo en unos momentos.';
          return throwError(() => new AuthError(msg));
        }),
      );
  }

  getToken(): string | null {
    try {
      const data = JSON.parse(localStorage.getItem(this.sessionKey) ?? '{}');
      return data?.token ?? null;
    } catch {
      return null;
    }
  }

  getUser(): AuthUser | null {
    try {
      const data = JSON.parse(localStorage.getItem(this.sessionKey) ?? '{}');
      return data?.user ?? null;
    } catch {
      return null;
    }
  }

  logout(): void {
    this.clearExpiryTimer();
    localStorage.removeItem(this.sessionKey);
    this.authenticated.set(false);
    this.sessionExpired.set(false);
    this.router.navigate(['/login']);
  }

  /** Llamado cuando el usuario reconoce que su sesión expiró. */
  dismissExpiredSession(): void {
    this.sessionExpired.set(false);
    this.logout();
  }

  checkSession(): void {
    const token = this.getToken();
    if (!token) {
      this.authenticated.set(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        this.showSessionExpired();
        return;
      }

      this.authenticated.set(true);
      this.scheduleExpiryFromToken(token);
    } catch {
      this.logout();
    }
  }

  private scheduleExpiryFromToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      const remaining = expiresAt - Date.now();

      if (remaining <= 0) {
        this.showSessionExpired();
        return;
      }

      this.startExpiryTimer(remaining);
    } catch {
      this.logout();
    }
  }

  private startExpiryTimer(ms: number): void {
    this.clearExpiryTimer();
    this.expiryTimer = setTimeout(() => {
      this.showSessionExpired();
    }, ms);
  }

  private clearExpiryTimer(): void {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
  }

  private showSessionExpired(): void {
    this.clearExpiryTimer();
    localStorage.removeItem(this.sessionKey);
    this.authenticated.set(false);
    this.sessionExpired.set(true);
  }

  private persistSession(response: LoginResponse): void {
    localStorage.setItem(this.sessionKey, JSON.stringify({ token: response.token, user: response.user }));
  }
}
