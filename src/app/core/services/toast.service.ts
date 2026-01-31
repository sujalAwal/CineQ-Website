import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  
  readonly toasts = this.toastsSignal.asReadonly();

  /**
   * Show a toast notification
   */
  show(toast: Omit<Toast, 'id'>): void {
    const newToast: Toast = {
      ...toast,
      id: 'toast_' + Date.now(),
      duration: toast.duration || 5000
    };

    this.toastsSignal.update(toasts => [...toasts, newToast]);

    // Auto dismiss after duration
    setTimeout(() => {
      this.dismiss(newToast.id);
    }, newToast.duration);
  }

  /**
   * Show success toast
   */
  success(title: string, message?: string): void {
    this.show({ type: 'success', title, message });
  }

  /**
   * Show error toast
   */
  error(title: string, message?: string): void {
    this.show({ type: 'error', title, message, duration: 7000 });
  }

  /**
   * Show warning toast
   */
  warning(title: string, message?: string): void {
    this.show({ type: 'warning', title, message });
  }

  /**
   * Show info toast
   */
  info(title: string, message?: string): void {
    this.show({ type: 'info', title, message });
  }

  /**
   * Dismiss a specific toast
   */
  dismiss(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    this.toastsSignal.set([]);
  }
}
