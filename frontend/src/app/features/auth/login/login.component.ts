import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AuthError } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly emailFocused = signal(false);
  readonly passwordFocused = signal(false);

  readonly authenticated = this.authService.authenticated;

  email = '';
  password = '';

  constructor() {
    effect(() => {
      const expired = this.authService.sessionExpired();
      if (expired) {
        this.email = '';
        this.password = '';
        this.error.set(null);
        this.loading.set(false);
        this.showPassword.set(false);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.email.trim() || !this.password) {
      this.error.set('Ingresa tu correo y contraseña.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err instanceof AuthError) {
          this.error.set(err.message);
        } else {
          this.error.set('Error inesperado. Inténtalo de nuevo.');
        }
      },
    });
  }
}
