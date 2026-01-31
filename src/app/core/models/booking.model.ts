import { Movie } from './movie.model';
import { User } from './user.model';

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
}

export interface BookingDetails {
  id: string;
  movie: Movie;
  showtime: {
    date: Date;
    time: string;
    theater: string;
  };
  seats: Seat[];
  totalAmount: number;
  convenienceFee: number;
  taxes: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  user?: User;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  icon: string;
}
