import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoginModalComponent } from './shared/components/login-modal/login-modal.component';
import { SignupModalComponent } from './shared/components/signup-modal/signup-modal.component';
import { SignupSuccessModalComponent } from './shared/components/signup-success-modal/signup-success-modal.component';
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
    SignupSuccessModalComponent,
    ToastComponent
  ],
  templateUrl: './app.html'
})
export class App {}
