import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoginModalComponent } from './shared/components/login-modal/login-modal.component';
import { SignupModalComponent } from './shared/components/signup-modal/signup-modal.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoginModalComponent,
    SignupModalComponent,
    ToastComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-dark-950">
      <app-navbar />
      
      <main class="flex-1">
        <router-outlet />
      </main>
      
      <app-footer />
      
      <!-- Global Modals -->
      <app-login-modal />
      <app-signup-modal />
      
      <!-- Toast Notifications -->
      <app-toast />
    </div>
  `,
  styles: []
})
export class App {}
