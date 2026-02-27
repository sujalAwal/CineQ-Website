import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';


declare const google: any;@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.component.html'
})
export class LoginModalComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });

  showError(field: string): boolean {
    const control = this.loginForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  close(): void {
    this.authService.closeLoginModal();
    this.loginForm.reset();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }

  switchToSignup(): void {
    this.authService.switchToSignup();
    this.loginForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    try {
      await this.authService.login(this.loginForm.value);
      this.loginForm.reset();
    } catch (error) {
      // Error already handled by AuthService toast
    }
  }

  loginWithGoogle(): void {
  google.accounts.id.initialize({
    client_id: environment.googleClientId,
    callback: async (response: any) => {
      try {
        await this.authService.googleLogin(response.credential);
        this.loginForm.reset();
      } catch (error) {
        // Error already handled by AuthService toast
      }
    },
    ux_mode: 'popup',        // ensures popup opens
    cancel_on_tap_outside: false
  });

  // Use renderButton instead of prompt()
  const buttonContainer = document.getElementById('google-signin-btn');
  if (buttonContainer) {
    buttonContainer.innerHTML = ''; // clear previous renders
    google.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      width: 300,
      text: 'signin_with'
    });

    // Programmatically click the rendered button
    (buttonContainer.querySelector('div[role="button"]') as HTMLElement)?.click();
  }
}
}
