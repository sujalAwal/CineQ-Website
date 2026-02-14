import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

// Password validation constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_PATTERN = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  digit: /[0-9]/,
  special: /[^A-Za-z0-9]/
};

// Phone validation: 7-20 chars, only digits, +, -, (, ), spaces
const PHONE_PATTERN = /^[0-9+\-\(\)\s]{7,20}$/;

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-modal.component.html'
})
export class SignupModalComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  signupForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+$/)]],
    middleName: ['', [Validators.pattern(/^[a-zA-Z]*$/)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(PHONE_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), this.passwordComplexityValidator]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  // Computed password validation state for UI hints
  readonly passwordValue = computed(() => this.signupForm.get('password')?.value || '');

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Custom validator for password complexity requirements
   */
  passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const errors: ValidationErrors = {};
    
    if (!PASSWORD_PATTERN.uppercase.test(password)) {
      errors['noUppercase'] = true;
    }
    if (!PASSWORD_PATTERN.lowercase.test(password)) {
      errors['noLowercase'] = true;
    }
    if (!PASSWORD_PATTERN.digit.test(password)) {
      errors['noDigit'] = true;
    }
    if (!PASSWORD_PATTERN.special.test(password)) {
      errors['noSpecial'] = true;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Password requirement checkers for UI
  hasMinLength(): boolean {
    return (this.signupForm.get('password')?.value?.length || 0) >= PASSWORD_MIN_LENGTH;
  }

  hasUppercase(): boolean {
    return PASSWORD_PATTERN.uppercase.test(this.signupForm.get('password')?.value || '');
  }

  hasLowercase(): boolean {
    return PASSWORD_PATTERN.lowercase.test(this.signupForm.get('password')?.value || '');
  }

  hasDigit(): boolean {
    return PASSWORD_PATTERN.digit.test(this.signupForm.get('password')?.value || '');
  }

  hasSpecialChar(): boolean {
    return PASSWORD_PATTERN.special.test(this.signupForm.get('password')?.value || '');
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
    
    if (password.length >= PASSWORD_MIN_LENGTH) strength++;
    if (PASSWORD_PATTERN.lowercase.test(password) && PASSWORD_PATTERN.uppercase.test(password)) strength++;
    if (PASSWORD_PATTERN.digit.test(password)) strength++;
    if (PASSWORD_PATTERN.special.test(password)) strength++;
    
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
      const { acceptTerms, ...signupData } = this.signupForm.value;
      await this.authService.signup(signupData);
      this.signupForm.reset();
    } catch (error) {
      // Error already handled by AuthService toast
    }
  }
}
