import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-session-expired',
  standalone: true,
  templateUrl: './session-expired.component.html',
  styleUrl: './session-expired.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiredComponent {
  private readonly authService = inject(AuthService);

  readonly visible = this.authService.sessionExpired;

  goToLogin(): void {
    this.authService.dismissExpiredSession();
  }
}
