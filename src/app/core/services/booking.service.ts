import { Injectable, signal, computed, inject } from '@angular/core';
import {
  BookingDetails,
  BookingSeat,
  PaymentMethod,
  SeatPayload,
  ApiPaymentMethod,
  InitiatePaymentApiRequest,
  InitiatePaymentApiResponseData,
  BookingApiResponse,
  SmartSeatSuggestionResponse,
  SeatPreference
} from '../models/booking.model';
import { Movie, Showtime } from '../models/movie.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);
  private currentBookingSignal = signal<Partial<BookingDetails> | null>(null);
  private selectedSeatsSignal = signal<BookingSeat[]>([]);
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
    return Math.round((this.totalAmount() + this.convenienceFee()) * 0.13); // 13% TAX
  });

  readonly grandTotal = computed(() => {
    return this.totalAmount() + this.convenienceFee() + this.taxes();
  });

  // Available payment methods (Nepali payment service providers)
  readonly paymentMethods: PaymentMethod[] = [
    { id: 'esewa', type: 'wallet', name: 'eSewa', icon: 'wallet' },
    { id: 'khalti', type: 'wallet', name: 'Khalti', icon: 'smartphone' },
    { id: 'connectips', type: 'netbanking', name: 'ConnectIPS', icon: 'building-library' }
  ];

  /**
   * Initialize a new booking
   */
  initBooking(movie: Movie, showtime: Showtime): void {
    this.currentBookingSignal.set({
      movie,
      showtime: {
        date: showtime.showDate,
        time: showtime.showTime,
        theater: showtime.theater.name,
        screen: showtime.screen.title
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
  generateSeats(rows: number = 8, seatsPerRow: number = 12): BookingSeat[] {
    const seats: BookingSeat[] = [];
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
  toggleSeatSelection(seat: BookingSeat): void {
    if (!seat.isAvailable) return;

    const currentSeats = this.selectedSeatsSignal();
    const existingIndex = currentSeats.findIndex(s => s.id === seat.id);

    if (existingIndex >= 0) {
      this.selectedSeatsSignal.set(currentSeats.filter(s => s.id !== seat.id));
    } else {
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
   * Update selected seats directly (used when coming from movie detail)
   */
  updateSelectedSeats(seats: BookingSeat[]): void {
    this.selectedSeatsSignal.set(seats);
  }

  /**
   * Initiate payment + booking in one atomic call.
   * For gateway methods (eSewa / Khalti) the browser navigates away —
   * this promise never resolves in those cases.
   */
  async confirmBooking(paymentMethodId: string, showtimeId: string | null): Promise<BookingDetails> {
    this.loadingSignal.set(true);

    try {
      if (!showtimeId) {
        throw new Error('Showtime ID is required');
      }

      const selectedSeats = this.selectedSeatsSignal();
      if (!selectedSeats.length) {
        throw new Error('No seats selected');
      }

      // Build seats payload (NO price — server resolves from showtime)
      const seatsPayload: SeatPayload[] = selectedSeats.map(seat => ({
        seatName: seat.id,
        row: seat.row,
        col: seat.number,
        code: seat.type === 'vip' ? 'V' : seat.type === 'premium' ? 'P' : 'R'
      }));

      // Convert to UPPERCASE enum value expected by backend
      const apiPaymentMethod = paymentMethodId.toUpperCase() as ApiPaymentMethod;

      const request: InitiatePaymentApiRequest = {
        showtimeId,
        seats: seatsPayload,
        paymentMethod: apiPaymentMethod
      };

      const response = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; data: InitiatePaymentApiResponseData }>(
          `${environment.api.baseUrl}/customer/initiate-payment`,
          request
        )
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Payment initiation failed');
      }

      const data = response.data;

      if (data.formActionUrl && data.formFields) {
        // eSewa: build a hidden POST form and auto-submit it
        this.submitHiddenForm(data.formActionUrl, data.formFields);
        // Page navigates away — return a never-resolving promise
        return new Promise<BookingDetails>(() => {});
      }

      if (data.paymentUrl) {
        // Khalti: redirect the user to the payment page
        window.location.href = data.paymentUrl;
        return new Promise<BookingDetails>(() => {});
      }

      throw new Error('No payment gateway URL received from server');

    } catch (error: any) {
      const msg = error?.error?.message || error?.message || 'Payment failed. Please try again.';
      throw new Error(msg);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Verify eSewa payment after redirect back from gateway.
   * Call with the base64-encoded ?data= param from the eSewa redirect URL.
   */
  async verifyEsewaPayment(data: string): Promise<BookingApiResponse> {
    const response = await firstValueFrom(
      this.http.post<{ success: boolean; message: string; data: BookingApiResponse }>(
        `${environment.api.baseUrl}/customer/payment/verify/esewa`,
        { data }
      )
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'eSewa payment verification failed');
    }
    return response.data;
  }

  /**
   * Verify Khalti payment after redirect back from gateway.
   * Call with the ?pidx= param from the Khalti redirect URL.
   */
  async verifyKhaltiPayment(pidx: string): Promise<BookingApiResponse> {
    const response = await firstValueFrom(
      this.http.post<{ success: boolean; message: string; data: BookingApiResponse }>(
        `${environment.api.baseUrl}/customer/payment/verify/khalti`,
        { pidx }
      )
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Khalti payment verification failed');
    }
    return response.data;
  }

  /**
   * Load the current customer's bookings from the API and populate the history signal.
   */
  async getMyBookings(): Promise<BookingDetails[]> {
    this.loadingSignal.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<{ success: boolean; message: string; data: BookingApiResponse[] }>(
          `${environment.api.baseUrl}/customer/bookings`
        )
      );
      if (response.success && response.data) {
        const bookings = response.data.map(b => this.mapApiBookingToDetails(b));
        this.bookingHistorySignal.set(bookings);
        return bookings;
      }
      return [];
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Cancel current booking (UI state only — does not call API)
   */
  cancelBooking(): void {
    this.currentBookingSignal.set(null);
    this.selectedSeatsSignal.set([]);
  }

  /**
   * Get booking by ID from local history signal
   */
  getBookingById(id: string): BookingDetails | undefined {
    return this.bookingHistorySignal().find(b => b.id === id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────────────

  /** Map API booking response to local BookingDetails shape */
  private mapApiBookingToDetails(api: BookingApiResponse): BookingDetails {
    const seatStatusToStatus = (code?: number): 'confirmed' | 'pending' | 'cancelled' => {
      if (code === 2) return 'confirmed';
      if (code === 3) return 'pending';
      return 'cancelled';
    };

    const seats: BookingSeat[] = (api.bookingDetails ?? []).map(detail => ({
      id: detail.seatName,
      row: detail.row,
      number: detail.col,
      type: detail.seatCode === 'V' ? 'vip' : detail.seatCode === 'P' ? 'premium' : 'standard',
      price: detail.seatPrice ?? 0,
      isAvailable: false,
      isSelected: true
    }));

    return {
      id: api.bookingReference,
      expiresAt: api.expiresAt,
      numberOfSeats: api.numberOfSeats,
      movie: {
        id: api.movieId ?? '',
        title: api.movieTitle ?? 'Unknown Movie',
        poster: api.moviePoster ?? '',
        duration: 0,
        releaseDate: '',
        status: '',
        genres: []
      },
      showtime: {
        date: api.showDate ?? '',
        time: api.showTime ?? '',
        theater: api.theatreName ?? '',
        screen: api.screenName ?? ''
      },
      seats,
      totalAmount: api.totalAmount ?? 0,
      convenienceFee: 0,
      taxes: 0,
      grandTotal: api.totalAmount ?? 0,
      status: seatStatusToStatus(api.seatStatusCode),
      createdAt: new Date(api.bookingDate ?? Date.now())
    };
  }

  /** Build and auto-submit a hidden POST form (for eSewa gateway) */
  private submitHiddenForm(actionUrl: string, formFields: Record<string, string>): void {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;

    Object.entries(formFields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  /**
   * Get AI-suggested seats based on the number of seats and preference
   */
  async getSmartSeatSuggestions(
    showtimeId: string,
    seats: number,
    seatPreference?: SeatPreference
  ): Promise<SmartSeatSuggestionResponse> {
    const payload: any = {
      showtimeId,
      seats: seats.toString()
    };

    if (seatPreference) {
      payload.seatPreference = seatPreference;
    }

    const response = await firstValueFrom(
      this.http.post<SmartSeatSuggestionResponse>(
        `${environment.api.baseUrl}/public/showtimes/suggest-seats`,
        payload
      )
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to get seat suggestions');
    }

    return response;
  }
}
