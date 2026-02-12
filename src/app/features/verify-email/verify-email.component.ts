import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  error = signal(false);
  message = signal('');
  countdown = signal(3);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (!token) {
        this.error.set(true);
        this.message.set('Invalid verification link. No token provided.');
        this.loading.set(false);
        return;
      }

      this.verifyEmail(token);
    });
  }

  private async verifyEmail(token: string): Promise<void> {
    try {
      await this.authService.verifyEmail(token);
      this.error.set(false);
      this.message.set('Email verified successfully! Redirecting to login...');
      this.startCountdown();
    } catch (error) {
      this.error.set(true);
      // Error message is already handled by AuthService toast
      this.message.set('Email verification failed. Please try again or resend verification email.');
    } finally {
      this.loading.set(false);
    }
  }

  private startCountdown(): void {
    let count = 3;
    this.countdownInterval = setInterval(() => {
      count--;
      this.countdown.set(count);

      if (count === 0) {
        this.clearCountdown();
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  private clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  resendVerification(): void {
    // This would require the user's email from context
    // For now, we'll direct them to the signup page to use the resend feature
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.clearCountdown();
    this.router.navigate(['/']);
    this.authService.openLoginModal();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }
}
