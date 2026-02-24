import { Component, inject, signal, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { getUserFullName } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService = inject(AuthService);
  
  isScrolled = signal(false);
  showMobileMenu = signal(false);
  showUserMenu = signal(false);
  showSearch = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showUserMenu.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
    this.showSearch.set(false);
  }

  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  toggleSearch(): void {
    this.showSearch.update(v => !v);
    this.showMobileMenu.set(false);
  }

  openLogin(): void {
    this.closeMobileMenu();
    this.authService.openLoginModal();
  }

  openSignup(): void {
    this.closeMobileMenu();
    this.authService.openSignupModal();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.closeUserMenu();
    this.closeMobileMenu();
  }
}
