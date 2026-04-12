import { Movie } from './movie.model';
import { User } from './user.model';

// Booking Seat type for order state management
export interface BookingSeat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
}

// Re-export Seat from movie.model to avoid import confusion
export type { Seat } from './movie.model';

export interface BookingDetails {
  id: string;
  movie: Movie;
  showtime: {
    date: string; // ISO format YYYY-MM-DD
    time: string; // HH:MM format
    theater: string; // Theater name
    screen: string; // Screen title
  };
  seats: BookingSeat[];
  totalAmount: number;
  convenienceFee: number;
  taxes: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  /** From GET /customer/bookings — payment hold expiry for pending bookings */
  expiresAt?: string;
  /** From API when seat rows are not expanded in bookingDetails */
  numberOfSeats?: number;
  user?: User;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  icon: string;
}

export interface InitiatePaymentRequest{
  bookingId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentGatewayResponse {
  success: boolean;
  paymentUrl?: string;
  message?: string;
}

// ─── API Interfaces for new booking/payment flow ───────────────────────────

/** Seat payload sent to /customer/initiate-payment (no price — server resolves it) */
export interface SeatPayload {
  seatName: string;
  row: string;
  col: number;
  code: string;
}

/** Payment method values accepted by the backend */
export type ApiPaymentMethod = 'ESEWA' | 'KHALTI' | 'CONNECTIPS';

/** Request body for POST /customer/initiate-payment */
export interface InitiatePaymentApiRequest {
  showtimeId: string;
  seats: SeatPayload[];
  paymentMethod: ApiPaymentMethod;
}

/** Data block inside the initiate-payment API response */
export interface InitiatePaymentApiResponseData {
  paymentId: string;
  bookingReference: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  expiresAt?: string;
  // eSewa: auto-submit hidden form to formActionUrl with these fields
  formActionUrl?: string;
  formFields?: Record<string, string>;
  // Khalti: redirect the user to this URL
  paymentUrl?: string;
}

/** Individual seat detail inside a BookingApiResponse */
export interface BookingDetailApiResponse {
  seatName: string;
  row: string;
  col: number;
  seatCode: string;
  seatPrice: number;
  seatStatusCode: number;
  seatStatusName?: string;
  seatStatusColor?: string;
}

/** Full booking record returned by GET /customer/bookings or verify endpoints */
export interface BookingApiResponse {
  id: string;
  bookingReference: string;
  showtimeId?: string;
  customerId?: string;
  bookingDate?: string;
  numberOfSeats?: number;
  totalAmount?: number;
  seatStatusCode?: number;
  seatStatusName?: string;
  seatStatusColor?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentReference?: string;
  expiresAt?: string;
  movieId?: string;
  movieTitle?: string;
  moviePoster?: string;
  theatreId?: string;
  theatreName?: string;
  screenId?: string;
  screenName?: string;
  showDate?: string;
  showTime?: string;
  language?: string;
  format?: string;
  bookingDetails?: BookingDetailApiResponse[];
}