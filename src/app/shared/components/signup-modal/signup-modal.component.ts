import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (authService.showSignupModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4" 
           (click)="onBackdropClick($event)">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"></div>
        
        <!-- Modal -->
        <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-dark-900 rounded-2xl shadow-2xl border border-dark-700 animate-scale-in"
             role="dialog" aria-modal="true" aria-labelledby="signup-title">
          <!-- Close Button -->
          <button (click)="close()" 
                  class="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors z-10"
                  aria-label="Close modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="p-6 pb-0 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <h2 id="signup-title" class="text-2xl font-display font-bold text-white mb-2">Create Account</h2>
            <p class="text-gray-400">Join CineQ and start booking movies</p>
          </div>

          <!-- Form -->
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div class="relative">
                <input id="fullName" 
                       type="text" 
                       formControlName="fullName"
                       class="input-field pl-10"
                       placeholder="John Doe"
                       [class.border-red-500]="showError('fullName')">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              @if (showError('fullName')) {
                <p class="mt-1 text-sm text-red-400">Full name is required</p>
              }
            </div>

            <!-- Email -->
            <div>
              <label for="signupEmail" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div class="relative">
                <input id="signupEmail" 
                       type="email" 
                       formControlName="email"
                       class="input-field pl-10"
                       placeholder="you@example.com"
                       [class.border-red-500]="showError('email')">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              @if (showError('email')) {
                <p class="mt-1 text-sm text-red-400">Please enter a valid email address</p>
              }
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <div class="relative">
                <input id="phone" 
                       type="tel" 
                       formControlName="phone"
                       class="input-field pl-10"
                       placeholder="+1 234 567 8900"
                       [class.border-red-500]="showError('phone')">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              @if (showError('phone')) {
                <p class="mt-1 text-sm text-red-400">Please enter a valid phone number</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label for="signupPassword" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div class="relative">
                <input [type]="showPassword() ? 'text' : 'password'" 
                       id="signupPassword"
                       formControlName="password"
                       class="input-field pl-10 pr-10"
                       placeholder="••••••••"
                       [class.border-red-500]="showError('password')">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <button type="button" 
                        (click)="togglePassword()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  @if (showPassword()) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
              <!-- Password Strength Indicator -->
              @if (signupForm.get('password')?.value) {
                <div class="mt-2 space-y-2">
                  <div class="flex space-x-1">
                    @for (i of [1,2,3,4]; track i) {
                      <div class="h-1 flex-1 rounded-full transition-colors duration-300"
                           [class.bg-red-500]="passwordStrength() >= 1 && i === 1"
                           [class.bg-orange-500]="passwordStrength() >= 2 && i === 2"
                           [class.bg-yellow-500]="passwordStrength() >= 3 && i === 3"
                           [class.bg-green-500]="passwordStrength() >= 4 && i === 4"
                           [class.bg-dark-700]="passwordStrength() < i">
                      </div>
                    }
                  </div>
                  <p class="text-xs" [class]="passwordStrengthClass()">{{ passwordStrengthText() }}</p>
                </div>
              }
              @if (showError('password')) {
                <p class="mt-1 text-sm text-red-400">Password must be at least 8 characters</p>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div class="relative">
                <input [type]="showConfirmPassword() ? 'text' : 'password'" 
                       id="confirmPassword"
                       formControlName="confirmPassword"
                       class="input-field pl-10 pr-10"
                       placeholder="••••••••"
                       [class.border-red-500]="showError('confirmPassword') || showPasswordMismatch()">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <button type="button" 
                        (click)="toggleConfirmPassword()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  @if (showConfirmPassword()) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
              @if (showPasswordMismatch()) {
                <p class="mt-1 text-sm text-red-400">Passwords do not match</p>
              }
            </div>

            <!-- Terms Checkbox -->
            <div class="flex items-start space-x-2">
              <input type="checkbox" formControlName="acceptTerms" 
                     id="acceptTerms"
                     class="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900">
              <label for="acceptTerms" class="text-sm text-gray-400">
                I agree to the 
                <a href="#" class="text-primary-400 hover:text-primary-300">Terms of Service</a> 
                and 
                <a href="#" class="text-primary-400 hover:text-primary-300">Privacy Policy</a>
              </label>
            </div>
            @if (showError('acceptTerms')) {
              <p class="text-sm text-red-400">You must accept the terms and conditions</p>
            }

            <!-- Submit Button -->
            <button type="submit" 
                    [disabled]="authService.loading() || signupForm.invalid"
                    class="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (authService.loading()) {
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              } @else {
                <span>Create Account</span>
              }
            </button>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-dark-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-dark-900 text-gray-400">Or sign up with</span>
              </div>
            </div>

            <!-- Social Signup Buttons -->
            <div class="grid grid-cols-2 gap-3">
              <button type="button" 
                      class="flex items-center justify-center space-x-2 py-2.5 px-4 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
                <span class="text-sm text-gray-300">Google</span>
              </button>
              <button type="button" 
                      class="flex items-center justify-center space-x-2 py-2.5 px-4 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
                <span class="text-sm text-gray-300">Facebook</span>
              </button>
            </div>
          </form>

          <!-- Footer -->
          <div class="px-6 pb-6 text-center">
            <p class="text-gray-400 text-sm">
              Already have an account?
              <button (click)="switchToLogin()" class="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class SignupModalComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  signupForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  showError(field: string): boolean {
    const control = this.signupForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  showPasswordMismatch(): boolean {
    const confirmPassword = this.signupForm.get('confirmPassword');
    return confirmPassword?.touched && this.signupForm.hasError('passwordMismatch') || false;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  passwordStrength(): number {
    const password = this.signupForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return strength;
  }

  passwordStrengthText(): string {
    const strength = this.passwordStrength();
    switch (strength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  }

  passwordStrengthClass(): string {
    const strength = this.passwordStrength();
    switch (strength) {
      case 1: return 'text-red-400';
      case 2: return 'text-orange-400';
      case 3: return 'text-yellow-400';
      case 4: return 'text-green-400';
      default: return 'text-gray-400';
    }
  }

  close(): void {
    this.authService.closeSignupModal();
    this.signupForm.reset();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }

  switchToLogin(): void {
    this.authService.switchToLogin();
    this.signupForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    try {
      const { confirmPassword, acceptTerms, ...signupData } = this.signupForm.value;
      await this.authService.signup(signupData);
      this.toastService.success('Account Created!', 'Welcome to CineQ. Start exploring movies!');
      this.signupForm.reset();
    } catch (error) {
      this.toastService.error('Signup Failed', 'Please try again later.');
    }
  }
}
