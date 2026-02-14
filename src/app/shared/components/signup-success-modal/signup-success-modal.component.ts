import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup-success-modal.component.html'
})
export class SignupSuccessModalComponent {
  authService = inject(AuthService);

  close(): void {
    this.authService.closeSignupSuccessAndOpenLogin();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
