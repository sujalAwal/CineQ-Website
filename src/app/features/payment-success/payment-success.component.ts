import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { BookingApiResponse } from '../../core/models/booking.model';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-950 flex items-center justify-center p-4">

      @if (loading()) {
        <!-- Verifying payment -->
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary-500 mx-auto mb-6"
               xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <h2 class="text-xl font-semibold text-white mb-2">Verifying your payment...</h2>
          <p class="text-gray-400 text-sm">Please wait, do not close this window.</p>
        </div>
      }

      @if (!loading() && success()) {
        <!-- Payment Confirmed -->
        <div class="card p-8 max-w-md w-full text-center animate-fade-in">
          <div class="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h1 class="text-2xl font-display font-bold text-white mb-2">Payment Successful!</h1>
          <p class="text-gray-400 mb-6">Your booking has been confirmed.</p>

          @if (bookingReference()) {
            <div class="p-4 bg-dark-800 rounded-lg mb-6">
              <div class="text-sm text-gray-400 mb-1">Booking Reference</div>
              <div class="text-xl font-mono font-bold text-primary-400">{{ bookingReference() }}</div>
            </div>
          }

          @if (booking()?.totalAmount) {
            <div class="p-4 bg-dark-800 rounded-lg mb-6">
              <div class="text-sm text-gray-400 mb-1">Amount Paid</div>
              <div class="text-xl font-bold text-white">₹{{ booking()!.totalAmount }}</div>
            </div>
          }

          <p class="text-sm text-gray-400 mb-8">
            A confirmation email has been sent to your registered email address.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/bookings" class="btn-primary py-3 px-6">View My Bookings</a>
            <a routerLink="/" class="btn-secondary py-3 px-6">Back to Home</a>
          </div>
        </div>
      }

      @if (!loading() && !success()) {
        <!-- Payment Failed -->
        <div class="card p-8 max-w-md w-full text-center animate-fade-in">
          <div class="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>

          <h1 class="text-2xl font-display font-bold text-white mb-2">Payment Failed</h1>
          <p class="text-gray-400 mb-6">{{ errorMessage() }}</p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/movies" class="btn-primary py-3 px-6">Browse Movies</a>
            <a routerLink="/" class="btn-secondary py-3 px-6">Back to Home</a>
          </div>
        </div>
      }

    </div>
  `,
  styles: []
})
export class PaymentSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  loading = signal(true);
  success = signal(false);
  booking = signal<BookingApiResponse | null>(null);
  bookingReference = signal<string | null>(null);
  errorMessage = signal<string>('Something went wrong. Please contact support.');

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const esewaData = params['data'];  // eSewa redirects with ?data=<base64>
    const khaltiPidx = params['pidx']; // Khalti redirects with ?pidx=<token>

    if (esewaData) {
      this.verifyEsewa(esewaData);
    } else if (khaltiPidx) {
      this.verifyKhalti(khaltiPidx);
    } else {
      this.loading.set(false);
      this.errorMessage.set('No payment data found. Please try booking again.');
    }
  }

  private async verifyEsewa(data: string): Promise<void> {
    try {
      const result = await this.bookingService.verifyEsewaPayment(data);
      this.booking.set(result);
      this.bookingReference.set(result.bookingReference);
      this.success.set(true);
    } catch (error: any) {
      const msg = error?.error?.message || error?.message || 'eSewa payment verification failed.';
      this.errorMessage.set(msg);
      this.success.set(false);
    } finally {
      this.loading.set(false);
    }
  }

  private async verifyKhalti(pidx: string): Promise<void> {
    try {
      const result = await this.bookingService.verifyKhaltiPayment(pidx);
      this.booking.set(result);
      this.bookingReference.set(result.bookingReference);
      this.success.set(true);
    } catch (error: any) {
      const msg = error?.error?.message || error?.message || 'Khalti payment verification failed.';
      this.errorMessage.set(msg);
      this.success.set(false);
    } finally {
      this.loading.set(false);
    }
  }
}
