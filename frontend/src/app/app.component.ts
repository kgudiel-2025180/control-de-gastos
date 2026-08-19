import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SessionExpiredComponent } from './shared/components/session-expired/session-expired.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SessionExpiredComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.checkSession();
  }
}
