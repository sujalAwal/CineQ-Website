import { Injectable, signal, computed, effect } from '@angular/core';
import { User, LoginCredentials, SignupData, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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

  constructor() {
    // Check for existing session on init
    this.loadStoredSession();
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
   * Simulates API call - replace with actual HTTP request
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    this.loadingSignal.set(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).toPromise();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful login
      const mockResponse: AuthResponse = {
        user: {
          id: 'user_1',
          fullName: 'John Doe',
          email: credentials.email,
          phone: '+1234567890',
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

      this.closeLoginModal();
      return mockResponse;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
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
