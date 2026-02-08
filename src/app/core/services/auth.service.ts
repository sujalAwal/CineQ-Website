import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, LoginCredentials, SignupData, AuthResponse, ApiErrorResponse, getUserFullName } from '../models/user.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

const AUTH_BASE_URL = `${environment.api.baseUrl}/frontend/customer/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(false);
  private showLoginModalSignal = signal<boolean>(false);
  private showSignupModalSignal = signal<boolean>(false);

  // Public readonly signals
  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly showLoginModal = this.showLoginModalSignal.asReadonly();
  readonly showSignupModal = this.showSignupModalSignal.asReadonly();
  
  readonly isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());

  /** Helper to get user display name */
  readonly userFullName = computed(() => getUserFullName(this.userSignal()));

  constructor() {
    this.loadStoredSession();
  }

  /**
   * Load user session from localStorage / sessionStorage
   */
  private loadStoredSession(): void {
    try {
      const storedUser = localStorage.getItem(environment.auth.userKey) || sessionStorage.getItem(environment.auth.userKey);
      const storedToken = localStorage.getItem(environment.auth.tokenKey) || sessionStorage.getItem(environment.auth.tokenKey);
      
      if (storedUser && storedToken) {
        this.userSignal.set(JSON.parse(storedUser));
        this.tokenSignal.set(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored session:', error);
      this.clearSession();
    }
  }

  // ──────────────────────────── Modal Management ────────────────────────────

  openLoginModal(): void {
    this.showSignupModalSignal.set(false);
    this.showLoginModalSignal.set(true);
  }

  closeLoginModal(): void {
    this.showLoginModalSignal.set(false);
  }

  openSignupModal(): void {
    this.showLoginModalSignal.set(false);
    this.showSignupModalSignal.set(true);
  }

  closeSignupModal(): void {
    this.showSignupModalSignal.set(false);
  }

  switchToSignup(): void {
    this.showLoginModalSignal.set(false);
    this.showSignupModalSignal.set(true);
  }

  switchToLogin(): void {
    this.showSignupModalSignal.set(false);
    this.showLoginModalSignal.set(true);
  }

  closeAllModals(): void {
    this.showLoginModalSignal.set(false);
    this.showSignupModalSignal.set(false);
  }

  // ──────────────────────────── Authentication API ────────────────────────────

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    this.loadingSignal.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${AUTH_BASE_URL}/login`, {
          email: credentials.email,
          password: credentials.password
        })
      );

      const user = this.mapAuthResponseToUser(response);
      this.userSignal.set(user);
      this.tokenSignal.set(response.token);

      // Persist session
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(environment.auth.userKey, JSON.stringify(user));
      storage.setItem(environment.auth.tokenKey, response.token);

      this.toastService.success('Welcome Back!', `Hello, ${response.firstName}!`);
      this.closeLoginModal();
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Register a new customer account
   */
  async signup(data: SignupData): Promise<void> {
    this.loadingSignal.set(true);

    try {
      await firstValueFrom(
        this.http.post(`${AUTH_BASE_URL}/register`, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          ...(data.phone && { phone: data.phone }),
          ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
          ...(data.gender && { gender: data.gender })
        })
      );

      this.toastService.success('Account Created!', 'Please check your email to verify your account, then log in.');
      this.closeSignupModal();
      this.openLoginModal();
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token = this.tokenSignal();
      if (token) {
        await firstValueFrom(
          this.http.post(`${AUTH_BASE_URL}/logout`, {})
        ).catch(() => {
          // Silently fail — clear local session regardless
        });
      }
    } finally {
      this.clearSession();
      this.toastService.info('Logged Out', 'You have been logged out successfully.');
    }
  }

  /**
   * Forgot password — request a reset link
   */
  async forgotPassword(email: string): Promise<void> {
    this.loadingSignal.set(true);

    try {
      await firstValueFrom(
        this.http.post(`${AUTH_BASE_URL}/forgot-password`, { email })
      );
      this.toastService.success('Email Sent', 'If the email exists, a reset link has been sent.');
    } catch (error) {
      // API always returns success to prevent enumeration, but handle network errors
      this.toastService.success('Email Sent', 'If the email exists, a reset link has been sent.');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    this.loadingSignal.set(true);

    try {
      await firstValueFrom(
        this.http.post(`${AUTH_BASE_URL}/reset-password`, { token, newPassword })
      );
      this.toastService.success('Password Reset', 'Your password has been reset. Please log in.');
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Validate a password reset token
   */
  async validateResetToken(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: { valid: boolean } }>(`${AUTH_BASE_URL}/validate-reset-token?token=${token}`)
      );
      return response?.data?.valid ?? false;
    } catch {
      return false;
    }
  }

  /**
   * Verify email with verification token
   */
  async verifyEmail(token: string): Promise<void> {
    this.loadingSignal.set(true);

    try {
      await firstValueFrom(
        this.http.post(`${AUTH_BASE_URL}/verify-email?token=${token}`, {})
      );
      this.toastService.success('Email Verified', 'Your email has been verified. You can now log in.');
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    this.loadingSignal.set(true);

    try {
      await firstValueFrom(
        this.http.post(`${AUTH_BASE_URL}/resend-verification`, { email })
      );
      this.toastService.success('Verification Sent', 'A new verification email has been sent.');
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ──────────────────────────── Helpers ────────────────────────────

  /**
   * Map the login AuthResponse to our User model
   */
  private mapAuthResponseToUser(response: AuthResponse): User {
    return {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      loyaltyPoints: response.loyaltyPoints ?? 0,
      isEmailVerified: response.isEmailVerified ?? false,
      role: response.role ?? 'CUSTOMER',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.email}`,
      createdAt: new Date()
    };
  }

  /**
   * Handle auth-related HTTP errors
   */
  private handleAuthError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as ApiErrorResponse | undefined;
      const message = body?.message || 'Something went wrong. Please try again.';
      this.toastService.error('Error', message);
    } else {
      this.toastService.error('Error', 'An unexpected error occurred.');
    }
  }

  /**
   * Clear user session from memory and storage
   */
  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem(environment.auth.userKey);
    localStorage.removeItem(environment.auth.tokenKey);
    sessionStorage.removeItem(environment.auth.userKey);
    sessionStorage.removeItem(environment.auth.tokenKey);
  }

  checkAuth(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Handle expired/invalid session (called by interceptor on 401)
   */
  handleSessionExpired(): void {
    this.clearSession();
    this.toastService.warning('Session Expired', 'Please log in again.');
    this.openLoginModal();
  }

  getCurrentUser(): User | null {
    return this.userSignal();
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
