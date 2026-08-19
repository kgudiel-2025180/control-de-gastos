import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getToken();
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    void this.router.navigate(['/login']);
  }
}