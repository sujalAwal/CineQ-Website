import { Injectable, signal, computed, inject } from '@angular/core';
import { User, LoginCredentials, SignupData, AuthResponse } from '../models/user.model';
import { ToastService } from './toast.service';

// Default credentials (temporary until backend is ready)
const DEFAULT_CREDENTIALS = {
  email: 'user@cineq.com',
  password: 'CineQ@2026'
};

const MAX_LOGIN_ATTEMPTS = 10;
const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private toastService = inject(ToastService);
  
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(false);
  private showLoginModalSignal = signal<boolean>(false);
  private showSignupModalSignal = signal<boolean>(false);
  private loginAttemptsSignal = signal<number>(0);
  private lockoutUntilSignal = signal<number | null>(null);

  // Public readonly signals
  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly showLoginModal = this.showLoginModalSignal.asReadonly();
  readonly showSignupModal = this.showSignupModalSignal.asReadonly();
  readonly loginAttempts = this.loginAttemptsSignal.asReadonly();
  readonly lockoutUntil = this.lockoutUntilSignal.asReadonly();
  
  readonly isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());
  readonly isLockedOut = computed(() => {
    const lockoutTime = this.lockoutUntilSignal();
    return lockoutTime ? Date.now() < lockoutTime : false;
  });
  readonly remainingAttempts = computed(() => {
    return Math.max(0, MAX_LOGIN_ATTEMPTS - this.loginAttemptsSignal());
  });

  constructor() {
    // Check for existing session on init
    this.loadStoredSession();
    this.loadLoginAttempts();
  }

  /**
   * Load user session from localStorage
   */
  private loadStoredSession(): void {
    try {
      const storedUser = localStorage.getItem('cineq_user');
      const storedToken = localStorage.getItem('cineq_token');
      
      if (storedUser && storedToken) {
        this.userSignal.set(JSON.parse(storedUser));
        this.tokenSignal.set(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored session:', error);
      this.clearSession();
    }
  }

  /**
   * Load login attempts from localStorage
   */
  private loadLoginAttempts(): void {
    try {
      const attempts = localStorage.getItem('cineq_login_attempts');
      const lockoutUntil = localStorage.getItem('cineq_lockout_until');
      
      if (attempts) {
        this.loginAttemptsSignal.set(parseInt(attempts, 10));
      }
      if (lockoutUntil) {
        const lockoutTime = parseInt(lockoutUntil, 10);
        if (Date.now() < lockoutTime) {
          this.lockoutUntilSignal.set(lockoutTime);
          const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / 60000);
          this.toastService.warning(
            'Account Temporarily Locked',
            `Too many failed attempts. Try again in ${remainingMinutes} minute(s).`
          );
        } else {
          // Lockout expired, reset
          this.resetLoginAttempts();
        }
      }
    } catch (error) {
      console.error('Error loading login attempts:', error);
    }
  }

  /**
   * Reset login attempts
   */
  private resetLoginAttempts(): void {
    this.loginAttemptsSignal.set(0);
    this.lockoutUntilSignal.set(null);
    localStorage.removeItem('cineq_login_attempts');
    localStorage.removeItem('cineq_lockout_until');
  }

  /**
   * Increment login attempts
   */
  private incrementLoginAttempts(): void {
    const newAttempts = this.loginAttemptsSignal() + 1;
    this.loginAttemptsSignal.set(newAttempts);
    localStorage.setItem('cineq_login_attempts', newAttempts.toString());

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION;
      this.lockoutUntilSignal.set(lockoutUntil);
      localStorage.setItem('cineq_lockout_until', lockoutUntil.toString());
      
      this.toastService.error(
        'Account Locked',
        'Too many failed login attempts. Please try again after 10 minutes.'
      );
    }
  }

  /**
   * Open login modal
   */
  openLoginModal(): void {
    this.showSignupModalSignal.set(false);
    this.showLoginModalSignal.set(true);
  }

  /**
   * Close login modal
   */
  closeLoginModal(): void {
    this.showLoginModalSignal.set(false);
  }

  /**
   * Open signup modal
   */
  openSignupModal(): void {
    this.showLoginModalSignal.set(false);
    this.showSignupModalSignal.set(true);
  }

  /**
   * Close signup modal
   */
  closeSignupModal(): void {
    this.showSignupModalSignal.set(false);
  }

  /**
   * Switch from login to signup modal
   */
  switchToSignup(): void {
    this.showLoginModalSignal.set(false);
    this.showSignupModalSignal.set(true);
  }

  /**
   * Switch from signup to login modal
   */
  switchToLogin(): void {
    this.showSignupModalSignal.set(false);
    this.showLoginModalSignal.set(true);
  }

  /**
   * Close all modals
   */
  closeAllModals(): void {
    this.showLoginModalSignal.set(false);
    this.showSignupModalSignal.set(false);
  }

  /**
   * Login with credentials
   * Uses default credentials until backend API is ready
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check if account is locked
    if (this.isLockedOut()) {
      const lockoutTime = this.lockoutUntilSignal();
      const remainingMinutes = lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 60000) : 10;
      this.toastService.error(
        'Account Locked',
        `Too many failed attempts. Try again in ${remainingMinutes} minute(s).`
      );
      throw new Error('Account temporarily locked');
    }

    this.loadingSignal.set(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).toPromise();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate credentials against default
      if (credentials.email !== DEFAULT_CREDENTIALS.email || 
          credentials.password !== DEFAULT_CREDENTIALS.password) {
        this.incrementLoginAttempts();
        
        const remaining = this.remainingAttempts();
        if (remaining > 0) {
          this.toastService.error(
            'Login Failed',
            `Invalid email or password. ${remaining} attempt(s) remaining.`
          );
        }
        
        throw new Error('Invalid credentials');
      }

      // Successful login - reset attempts
      this.resetLoginAttempts();

      const mockResponse: AuthResponse = {
        user: {
          id: 'user_' + Date.now(),
          fullName: 'CineQ User',
          email: credentials.email,
          phone: '9876543210',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.email,
          createdAt: new Date()
        },
        token: 'mock_jwt_token_' + Date.now(),
        expiresIn: 86400 // 24 hours
      };

      this.userSignal.set(mockResponse.user);
      this.tokenSignal.set(mockResponse.token);

      // Store in localStorage if remember me
      if (credentials.rememberMe) {
        localStorage.setItem('cineq_user', JSON.stringify(mockResponse.user));
        localStorage.setItem('cineq_token', mockResponse.token);
      } else {
        sessionStorage.setItem('cineq_user', JSON.stringify(mockResponse.user));
        sessionStorage.setItem('cineq_token', mockResponse.token);
      }

      this.toastService.success('Welcome Back!', 'Login successful');
      this.closeLoginModal();
      return mockResponse;
    } catch (error) {
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Sign up new user
   * Simulates API call - replace with actual HTTP request
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    this.loadingSignal.set(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, data).toPromise();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful signup
      const mockResponse: AuthResponse = {
        user: {
          id: 'user_' + Date.now(),
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + data.email,
          createdAt: new Date()
        },
        token: 'mock_jwt_token_' + Date.now(),
        expiresIn: 86400
      };

      this.userSignal.set(mockResponse.user);
      this.tokenSignal.set(mockResponse.token);

      // Store in localStorage
      localStorage.setItem('cineq_user', JSON.stringify(mockResponse.user));
      localStorage.setItem('cineq_token', mockResponse.token);

      this.toastService.success('Welcome!', 'Account created successfully');
      this.closeSignupModal();
      return mockResponse;
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearSession();
    this.toastService.info('Logged Out', 'You have been logged out successfully');
  }

  /**
   * Clear user session
   */
  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem('cineq_user');
    localStorage.removeItem('cineq_token');
    sessionStorage.removeItem('cineq_user');
    sessionStorage.removeItem('cineq_token');
  }

  /**
   * Check if user is authenticated
   */
  checkAuth(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.userSignal();
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.tokenSignal();
  }
}
