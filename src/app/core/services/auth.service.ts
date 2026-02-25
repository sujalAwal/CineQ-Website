import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, LoginCredentials, SignupData, AuthResponse, ApiErrorResponse, ApiSuccessResponse, getUserFullName } from '../models/user.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

const AUTH_BASE_URL = `${environment.api.baseUrl}/customer/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  private userSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  private showLoginModalSignal = signal<boolean>(false);
  private showSignupModalSignal = signal<boolean>(false);
  private showSignupSuccessModalSignal = signal<boolean>(false);

  // Public readonly signals
  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly showLoginModal = this.showLoginModalSignal.asReadonly();
  readonly showSignupModal = this.showSignupModalSignal.asReadonly();
  readonly showSignupSuccessModal = this.showSignupSuccessModalSignal.asReadonly();
  
  // Authentication is now based on user data presence (cookie validated server-side)
  readonly isAuthenticated = computed(() => !!this.userSignal());

  /** Helper to get user display name */
  readonly userFullName = computed(() => getUserFullName(this.userSignal()));

  constructor() {
    this.loadStoredSession();
  }

  /**
   * Load user session from localStorage / sessionStorage
   * Note: JWT token is now stored in HttpOnly cookie (managed by browser)
   * We only cache user data locally for UI purposes
   */
  private loadStoredSession(): void {
    try {
      const storedUser = localStorage.getItem(environment.auth.userKey) || sessionStorage.getItem(environment.auth.userKey);
      
      if (storedUser) {
        this.userSignal.set(JSON.parse(storedUser));
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
    this.showSignupSuccessModalSignal.set(false);
  }

  openSignupSuccessModal(): void {
    this.showSignupSuccessModalSignal.set(true);
  }

  closeSignupSuccessModal(): void {
    this.showSignupSuccessModalSignal.set(false);
  }

  closeSignupSuccessAndOpenLogin(): void {
    this.showSignupSuccessModalSignal.set(false);
    this.showLoginModalSignal.set(true);
  }

  // ──────────────────────────── Authentication API ────────────────────────────

  /**
   * Login with credentials
   * Note: JWT token is now set as HttpOnly cookie by the server
   */
  async login(credentials: LoginCredentials): Promise<void> {
    this.loadingSignal.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<ApiSuccessResponse<AuthResponse>>(`${AUTH_BASE_URL}/login`, {
          email: credentials.email,
          password: credentials.password
        })
      );

      const authData = response.data;
      const user = this.mapAuthResponseToUser(authData);
      this.userSignal.set(user);

      // Persist user data locally for UI (token is in HttpOnly cookie)
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(environment.auth.userKey, JSON.stringify(user));

      this.toastService.success('Welcome Back!', `Hello, ${authData.firstName}!`);
      this.closeLoginModal();
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }


  /**
   * Login with Google credential
   * Note: JWT token is now set as HttpOnly cookie by the server
   */
  async googleLogin(idToken: string): Promise<void> {
    this.loadingSignal.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<ApiSuccessResponse<AuthResponse>>(`${AUTH_BASE_URL}/login/google`, {
          credential: idToken
        })
      );

      const authData = response.data;
      const user = this.mapAuthResponseToUser(authData);
      this.userSignal.set(user);

      // Persist user data in localStorage (Google login = persistent session)
      localStorage.setItem(environment.auth.userKey, JSON.stringify(user));

      this.toastService.success('Welcome Back!', `Hello, ${authData.firstName}!`);
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
          ...(data.middleName && { middleName: data.middleName }),
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          ...(data.phone && { phone: data.phone }),
          ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
          ...(data.gender && { gender: data.gender })
        })
      );

      this.closeSignupModal();
      this.openSignupSuccessModal();
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Logout user
   * Note: Server will clear the HttpOnly cookie
   */
  async logout(): Promise<void> {
    try {
      // Always call logout endpoint - server extracts token from cookie
      await firstValueFrom(
        this.http.post(`${AUTH_BASE_URL}/logout`, {})
      ).catch(() => {
        // Silently fail — clear local session regardless
      });
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
      middleName: response.middleName,
      lastName: response.lastName,
      email: response.email,
      loyaltyPoints: response.loyaltyPoints ?? 0,
      isEmailVerified: response.isEmailVerified ?? false,
      role: response.role ?? 'NA',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.email}`,
      createdAt: new Date()
    };
  }

  /**
   * Handle auth-related HTTP errors
   */
  private handleAuthError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      // Rate limit errors are handled by interceptor, skip duplicate toast
      if (error.status === 429) {
        return;
      }
      
      const body = error.error as ApiErrorResponse | undefined;
      let message = body?.message || 'Something went wrong. Please try again.';
      
      // Handle account lockout with countdown extraction
      if (error.status === 400 && message.toLowerCase().includes('locked')) {
        const match = message.match(/(\d+)\s*minutes?/i);
        if (match) {
          message = `Your account is temporarily locked. Please try again in ${match[1]} minutes.`;
        }
      }
      
      this.toastService.error('Error', message);
    } else {
      this.toastService.error('Error', 'An unexpected error occurred.');
    }
  }

  /**
   * Clear user session from memory and storage
   * Note: HttpOnly cookie is cleared by the server on logout
   */
  private clearSession(): void {
    this.userSignal.set(null);
    localStorage.removeItem(environment.auth.userKey);
    sessionStorage.removeItem(environment.auth.userKey);
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

  /**
   * Update the cached user data (for profile updates)
   */
  updateUserData(user: User): void {
    this.userSignal.set(user);
    // Update in whichever storage the user was stored
    if (localStorage.getItem(environment.auth.userKey)) {
      localStorage.setItem(environment.auth.userKey, JSON.stringify(user));
    } else {
      sessionStorage.setItem(environment.auth.userKey, JSON.stringify(user));
    }
  }
}
