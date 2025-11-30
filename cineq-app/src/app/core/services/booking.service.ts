import { Injectable, signal, computed } from '@angular/core';
import { BookingDetails, Seat, PaymentMethod } from '../models/booking.model';
import { Movie, Showtime } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private currentBookingSignal = signal<Partial<BookingDetails> | null>(null);
  private selectedSeatsSignal = signal<Seat[]>([]);
  private loadingSignal = signal<boolean>(false);
  private bookingHistorySignal = signal<BookingDetails[]>([]);

  // Public readonly signals
  readonly currentBooking = this.currentBookingSignal.asReadonly();
  readonly selectedSeats = this.selectedSeatsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly bookingHistory = this.bookingHistorySignal.asReadonly();

  // Computed values
  readonly totalAmount = computed(() => {
    return this.selectedSeatsSignal().reduce((sum, seat) => sum + seat.price, 0);
  });

  readonly convenienceFee = computed(() => {
    return Math.round(this.totalAmount() * 0.05); // 5% convenience fee
  });

  readonly taxes = computed(() => {
    return Math.round((this.totalAmount() + this.convenienceFee()) * 0.18); // 18% GST
  });

  readonly grandTotal = computed(() => {
    return this.totalAmount() + this.convenienceFee() + this.taxes();
  });

  // Available payment methods
  readonly paymentMethods: PaymentMethod[] = [
    { id: 'card', type: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'upi', type: 'upi', name: 'UPI', icon: 'smartphone' },
    { id: 'netbanking', type: 'netbanking', name: 'Net Banking', icon: 'building-library' },
    { id: 'wallet', type: 'wallet', name: 'Digital Wallet', icon: 'wallet' }
  ];

  constructor() {
    this.loadBookingHistory();
  }

  /**
   * Initialize a new booking
   */
  initBooking(movie: Movie, showtime: Showtime): void {
    this.currentBookingSignal.set({
      movie,
      showtime: {
        date: showtime.date,
        time: showtime.time,
        theater: showtime.theater
      },
      seats: [],
      totalAmount: 0,
      convenienceFee: 0,
      taxes: 0,
      grandTotal: 0,
      status: 'pending',
      createdAt: new Date()
    });
    this.selectedSeatsSignal.set([]);
  }

  /**
   * Generate seats for a theater
   */
  generateSeats(rows: number = 8, seatsPerRow: number = 12): Seat[] {
    const seats: Seat[] = [];
    const rowLabels = 'ABCDEFGHIJKLMNOP'.split('');
    
    for (let r = 0; r < rows; r++) {
      for (let s = 1; s <= seatsPerRow; s++) {
        const type = r < 2 ? 'standard' : r < 5 ? 'premium' : 'vip';
        const price = type === 'standard' ? 200 : type === 'premium' ? 300 : 450;
        
        seats.push({
          id: `${rowLabels[r]}${s}`,
          row: rowLabels[r],
          number: s,
          type,
          price,
          isAvailable: Math.random() > 0.3, // 70% seats available
          isSelected: false
        });
      }
    }
    
    return seats;
  }

  /**
   * Select/Deselect a seat
   */
  toggleSeatSelection(seat: Seat): void {
    if (!seat.isAvailable) return;

    const currentSeats = this.selectedSeatsSignal();
    const existingIndex = currentSeats.findIndex(s => s.id === seat.id);

    if (existingIndex >= 0) {
      // Remove seat
      this.selectedSeatsSignal.set(currentSeats.filter(s => s.id !== seat.id));
    } else {
      // Add seat (max 10 seats per booking)
      if (currentSeats.length < 10) {
        this.selectedSeatsSignal.set([...currentSeats, { ...seat, isSelected: true }]);
      }
    }
  }

  /**
   * Clear selected seats
   */
  clearSelectedSeats(): void {
    this.selectedSeatsSignal.set([]);
  }

  /**
   * Process payment and confirm booking
   * Simulates API call
   */
  async confirmBooking(paymentMethodId: string): Promise<BookingDetails> {
    this.loadingSignal.set(true);

    try {
      // TODO: Replace with actual API call
      // const response = await this.http.post<BookingDetails>(`${environment.apiUrl}/bookings`, {...}).toPromise();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const booking = this.currentBookingSignal();
      if (!booking || !booking.movie) {
        throw new Error('No booking in progress');
      }

      const confirmedBooking: BookingDetails = {
        id: 'BK' + Date.now(),
        movie: booking.movie,
        showtime: booking.showtime!,
        seats: this.selectedSeatsSignal(),
        totalAmount: this.totalAmount(),
        convenienceFee: this.convenienceFee(),
        taxes: this.taxes(),
        grandTotal: this.grandTotal(),
        status: 'confirmed',
        createdAt: new Date()
      };

      // Add to booking history
      const history = this.bookingHistorySignal();
      this.bookingHistorySignal.set([confirmedBooking, ...history]);
      this.saveBookingHistory();

      // Clear current booking
      this.currentBookingSignal.set(null);
      this.selectedSeatsSignal.set([]);

      return confirmedBooking;
    } catch (error) {
      throw new Error('Payment failed. Please try again.');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Cancel current booking
   */
  cancelBooking(): void {
    this.currentBookingSignal.set(null);
    this.selectedSeatsSignal.set([]);
  }

  /**
   * Load booking history from localStorage
   */
  private loadBookingHistory(): void {
    try {
      const stored = localStorage.getItem('cineq_booking_history');
      if (stored) {
        this.bookingHistorySignal.set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading booking history:', error);
    }
  }

  /**
   * Save booking history to localStorage
   */
  private saveBookingHistory(): void {
    try {
      localStorage.setItem('cineq_booking_history', JSON.stringify(this.bookingHistorySignal()));
    } catch (error) {
      console.error('Error saving booking history:', error);
    }
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: string): BookingDetails | undefined {
    return this.bookingHistorySignal().find(b => b.id === id);
  }
}
