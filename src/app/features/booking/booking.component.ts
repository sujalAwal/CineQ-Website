import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { MovieService } from '../../core/services/movie.service';
import { ToastService } from '../../core/services/toast.service';
import { Seat } from '../../core/models/booking.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (bookingService.currentBooking()) {
      <div class="min-h-screen bg-dark-950 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm">
              <li><a routerLink="/" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><span class="text-gray-600">/</span></li>
              <li><a [routerLink]="['/movie', bookingService.currentBooking()?.movie?.id]" class="text-gray-400 hover:text-white transition-colors">{{ bookingService.currentBooking()?.movie?.title }}</a></li>
              <li><span class="text-gray-600">/</span></li>
              <li><span class="text-primary-400">Booking</span></li>
            </ol>
          </nav>

          <!-- Progress Steps -->
          <div class="flex items-center justify-center mb-12">
            <div class="flex items-center space-x-4">
              @for (step of steps; track step.id; let i = $index) {
                <div class="flex items-center">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300"
                         [class.bg-primary-500]="currentStep() >= step.id"
                         [class.text-white]="currentStep() >= step.id"
                         [class.bg-dark-700]="currentStep() < step.id"
                         [class.text-gray-400]="currentStep() < step.id">
                      @if (currentStep() > step.id) {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      } @else {
                        {{ step.id }}
                      }
                    </div>
                    <span class="ml-2 text-sm font-medium hidden sm:block"
                          [class.text-white]="currentStep() >= step.id"
                          [class.text-gray-400]="currentStep() < step.id">
                      {{ step.name }}
                    </span>
                  </div>
                  @if (i < steps.length - 1) {
                    <div class="w-12 sm:w-24 h-0.5 mx-4 transition-colors duration-300"
                         [class.bg-primary-500]="currentStep() > step.id"
                         [class.bg-dark-700]="currentStep() <= step.id">
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Step 1: Seat Selection -->
              @if (currentStep() === 1) {
                <div class="card p-6 animate-fade-in">
                  <h2 class="text-xl font-semibold text-white mb-6">Select Your Seats</h2>
                  
                  <!-- Screen -->
                  <div class="relative mb-8">
                    <div class="h-2 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full mb-2"></div>
                    <div class="text-center text-sm text-gray-400">SCREEN</div>
                  </div>

                  <!-- Seat Legend -->
                  <div class="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded bg-dark-600 border border-dark-500"></div>
                      <span class="text-gray-400">Available</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded bg-primary-500"></div>
                      <span class="text-gray-400">Selected</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded bg-dark-800"></div>
                      <span class="text-gray-400">Sold</span>
                    </div>
                  </div>

                  <!-- Seat Types Info -->
                  <div class="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded bg-green-500/20 border border-green-500/50"></div>
                      <span class="text-gray-400">Standard (₹200)</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded bg-blue-500/20 border border-blue-500/50"></div>
                      <span class="text-gray-400">Premium (₹300)</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded bg-yellow-500/20 border border-yellow-500/50"></div>
                      <span class="text-gray-400">VIP (₹450)</span>
                    </div>
                  </div>

                  <!-- Seat Grid -->
                  <div class="overflow-x-auto">
                    <div class="min-w-[500px] flex flex-col items-center space-y-2">
                      @for (row of groupedSeats(); track row.row) {
                        <div class="flex items-center space-x-2">
                          <span class="w-6 text-center text-sm font-medium text-gray-400">{{ row.row }}</span>
                          <div class="flex space-x-2">
                            @for (seat of row.seats; track seat.id; let i = $index) {
                              @if (i === 6) {
                                <div class="w-4"></div>
                              }
                              <button (click)="toggleSeat(seat)"
                                      [disabled]="!seat.isAvailable"
                                      class="w-8 h-8 rounded text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed"
                                      [class]="getSeatClass(seat)">
                                {{ seat.number }}
                              </button>
                            }
                          </div>
                          <span class="w-6 text-center text-sm font-medium text-gray-400">{{ row.row }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Selected Seats Summary -->
                  @if (bookingService.selectedSeats().length > 0) {
                    <div class="mt-8 p-4 bg-dark-800 rounded-lg">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-gray-400">Selected Seats: </span>
                          <span class="text-white font-medium">{{ formatSelectedSeats() }}</span>
                        </div>
                        <button (click)="bookingService.clearSelectedSeats()" class="text-red-400 hover:text-red-300 text-sm">
                          Clear All
                        </button>
                      </div>
                    </div>
                  }

                  <!-- Continue Button -->
                  <div class="mt-8 flex justify-end">
                    <button (click)="nextStep()" 
                            [disabled]="bookingService.selectedSeats().length === 0"
                            class="btn-primary py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed">
                      Continue to Payment
                    </button>
                  </div>
                </div>
              }

              <!-- Step 2: Payment -->
              @if (currentStep() === 2) {
                <div class="card p-6 animate-fade-in">
                  <h2 class="text-xl font-semibold text-white mb-6">Payment Method</h2>

                  <!-- Payment Options -->
                  <div class="space-y-4">
                    @for (method of bookingService.paymentMethods; track method.id) {
                      <button (click)="selectPaymentMethod(method.id)"
                              class="w-full p-4 rounded-lg border transition-all duration-300 text-left flex items-center space-x-4"
                              [class.border-primary-500]="selectedPaymentMethod() === method.id"
                              [class.bg-primary-500/10]="selectedPaymentMethod() === method.id"
                              [class.border-dark-700]="selectedPaymentMethod() !== method.id"
                              [class.bg-dark-800]="selectedPaymentMethod() !== method.id">
                        <div class="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center">
                          @switch (method.icon) {
                            @case ('credit-card') {
                              <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                              </svg>
                            }
                            @case ('smartphone') {
                              <svg class="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            }
                            @case ('building-library') {
                              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                              </svg>
                            }
                            @case ('wallet') {
                              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                              </svg>
                            }
                          }
                        </div>
                        <div>
                          <div class="font-medium text-white">{{ method.name }}</div>
                          <div class="text-sm text-gray-400">Pay securely using {{ method.name }}</div>
                        </div>
                        @if (selectedPaymentMethod() === method.id) {
                          <div class="ml-auto">
                            <svg class="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        }
                      </button>
                    }
                  </div>

                  <!-- Card Details (if card selected) -->
                  @if (selectedPaymentMethod() === 'card') {
                    <div class="mt-6 p-4 bg-dark-800 rounded-lg space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" class="input-field">
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" class="input-field">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                          <input type="text" placeholder="123" class="input-field">
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" class="input-field">
                      </div>
                    </div>
                  }

                  <!-- Action Buttons -->
                  <div class="mt-8 flex justify-between">
                    <button (click)="prevStep()" class="btn-ghost py-3 px-6 border border-dark-600">
                      Back
                    </button>
                    <button (click)="confirmPayment()" 
                            [disabled]="!selectedPaymentMethod() || bookingService.loading()"
                            class="btn-primary py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                      @if (bookingService.loading()) {
                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      } @else {
                        <span>Pay ₹{{ bookingService.grandTotal() }}</span>
                      }
                    </button>
                  </div>
                </div>
              }

              <!-- Step 3: Confirmation -->
              @if (currentStep() === 3) {
                <div class="card p-8 text-center animate-fade-in">
                  <div class="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h2 class="text-2xl font-display font-bold text-white mb-2">Booking Confirmed!</h2>
                  <p class="text-gray-400 mb-6">Your tickets have been booked successfully.</p>
                  
                  @if (confirmedBookingId()) {
                    <div class="p-4 bg-dark-800 rounded-lg mb-6">
                      <div class="text-sm text-gray-400 mb-1">Booking ID</div>
                      <div class="text-xl font-mono font-bold text-primary-400">{{ confirmedBookingId() }}</div>
                    </div>
                  }

                  <p class="text-sm text-gray-400 mb-8">A confirmation email has been sent to your registered email address.</p>

                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="btn-secondary py-3 px-6">
                      Download Ticket
                    </button>
                    <a routerLink="/" class="btn-primary py-3 px-6">
                      Back to Home
                    </a>
                  </div>
                </div>
              }
            </div>

            <!-- Booking Summary Sidebar -->
            <div class="lg:col-span-1">
              <div class="card p-6 sticky top-24">
                <h3 class="text-lg font-semibold text-white mb-4">Booking Summary</h3>
                
                <!-- Movie Info -->
                <div class="flex space-x-4 mb-6 pb-6 border-b border-dark-700">
                  <img [src]="bookingService.currentBooking()?.movie?.poster" 
                       [alt]="bookingService.currentBooking()?.movie?.title"
                       class="w-20 h-28 object-cover rounded-lg">
                  <div>
                    <h4 class="font-semibold text-white">{{ bookingService.currentBooking()?.movie?.title }}</h4>
                    <p class="text-sm text-gray-400">{{ bookingService.currentBooking()?.movie?.language }}</p>
                    <p class="text-sm text-gray-400 mt-2">{{ bookingService.currentBooking()?.showtime?.theater }}</p>
                    <p class="text-sm text-primary-400">{{ bookingService.currentBooking()?.showtime?.time }}</p>
                  </div>
                </div>

                <!-- Ticket Details -->
                @if (bookingService.selectedSeats().length > 0) {
                  <div class="space-y-3 mb-6 pb-6 border-b border-dark-700">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-400">Tickets ({{ bookingService.selectedSeats().length }})</span>
                      <span class="text-white">{{ formatSelectedSeats() }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-400">Subtotal</span>
                      <span class="text-white">₹{{ bookingService.totalAmount() }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-400">Convenience Fee</span>
                      <span class="text-white">₹{{ bookingService.convenienceFee() }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-400">GST (18%)</span>
                      <span class="text-white">₹{{ bookingService.taxes() }}</span>
                    </div>
                  </div>

                  <!-- Total -->
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-white">Total</span>
                    <span class="text-2xl font-bold text-primary-400">₹{{ bookingService.grandTotal() }}</span>
                  </div>
                } @else {
                  <p class="text-center text-gray-400 py-4">Select seats to continue</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <!-- No Booking -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-dark-800 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-white mb-2">No Active Booking</h2>
          <p class="text-gray-400 mb-6">Please select a movie and showtime to start booking.</p>
          <a routerLink="/movies" class="btn-primary">Browse Movies</a>
        </div>
      </div>
    }
  `,
  styles: []
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  bookingService = inject(BookingService);
  private movieService = inject(MovieService);
  private toastService = inject(ToastService);

  currentStep = signal(1);
  selectedPaymentMethod = signal<string | null>(null);
  confirmedBookingId = signal<string | null>(null);
  seats = signal<Seat[]>([]);

  steps = [
    { id: 1, name: 'Select Seats' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Confirmation' }
  ];

  groupedSeats = computed(() => {
    const seatsByRow: { [key: string]: Seat[] } = {};
    
    for (const seat of this.seats()) {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    }

    return Object.keys(seatsByRow)
      .sort()
      .map(row => ({ row, seats: seatsByRow[row] }));
  });

  ngOnInit(): void {
    // Generate seats
    this.seats.set(this.bookingService.generateSeats());

    // Check if booking exists
    if (!this.bookingService.currentBooking()) {
      const movieId = this.route.snapshot.params['movieId'];
      if (movieId) {
        // TODO: Implement showtime selection when booking API is ready
        this.router.navigate(['/movies']);
      } else {
        this.router.navigate(['/movies']);
      }
    }
  }

  getSeatClass(seat: Seat): string {
    const selectedSeats = this.bookingService.selectedSeats();
    const isSelected = selectedSeats.some(s => s.id === seat.id);

    if (!seat.isAvailable) {
      return 'bg-dark-800 text-dark-600 cursor-not-allowed';
    }

    if (isSelected) {
      return 'bg-primary-500 text-white';
    }

    switch (seat.type) {
      case 'standard':
        return 'bg-dark-700 border border-green-500/50 text-gray-300 hover:bg-green-500/20';
      case 'premium':
        return 'bg-dark-700 border border-blue-500/50 text-gray-300 hover:bg-blue-500/20';
      case 'vip':
        return 'bg-dark-700 border border-yellow-500/50 text-gray-300 hover:bg-yellow-500/20';
      default:
        return 'bg-dark-700 text-gray-300';
    }
  }

  toggleSeat(seat: Seat): void {
    this.bookingService.toggleSeatSelection(seat);
  }

  formatSelectedSeats(): string {
    return this.bookingService.selectedSeats()
      .map(s => s.id)
      .sort()
      .join(', ');
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod.set(methodId);
  }

  async confirmPayment(): Promise<void> {
    const paymentMethod = this.selectedPaymentMethod();
    if (!paymentMethod) return;

    try {
      const booking = await this.bookingService.confirmBooking(paymentMethod);
      this.confirmedBookingId.set(booking.id);
      this.currentStep.set(3);
      this.toastService.success('Booking Confirmed!', 'Your tickets have been booked successfully.');
    } catch (error) {
      this.toastService.error('Payment Failed', 'Please try again.');
    }
  }
}
