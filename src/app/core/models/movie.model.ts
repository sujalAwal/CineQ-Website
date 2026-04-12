// Genre interface from API
export interface Genre {
  id: string;
  name: string;
}

// Artist Type interface
export interface ArtistType {
  id: string;
  name: string; // Actor, Actress, Director, etc.
  icon?: string; // Icon class
  description?: string;
}

// Artist interface (detailed)
export interface Artist {
  id: string;
  fullName: string;
  avatar?: string; // Image URL
  rating?: number;
  bio?: string;
}

// Cast/Starcast interface from API (now with nested objects)
export interface StarCast {
  characterName: string;
  artistId: string;
  artist: Artist; // Always required from API
  artistTypeId: string;
  artistType?: ArtistType | null;
}

// Screen interface
export interface Screen {
  id: string;
  title: string;
}

// Theater interface for showtime
export interface TheaterDetail {
  id: string;
  name: string;
}

// Showtime interface - for listing showtimes
export interface Showtime {
  id: string;
  movieId: string;
  showDate: string; // ISO format YYYY-MM-DD
  showTime: string; // HH:MM format
  theater: TheaterDetail;
  screen: Screen;
  statusCode: string; // 'AV' for available
}

// Seat in seat layout
export interface Seat {
  seatName: string;
  row: string;
  col: number;
  code: string; // 'V' for VIP, 'P' for premium, 'R' for regular, 'X' for not available
  price: number;
}

// Price layout info
export interface PriceLayout {
  code: string;
  basePrice: number;
}

// Seat type from API
export interface SeatType {
  id: string;
  code: string; // 'V', 'P', 'R', 'X'
  name: string; // 'VIP', 'Premium', 'Regular', 'Aisle'
  color: string; // Hex color code (e.g., '#57e389')
  description?: string;
  isActive: boolean;
}

// Showtime detail response with seat layout
export interface ShowtimeDetail {
  showTime: string;
  format: string; // '2D', '3D', etc.
  movieId: string;
  language: string; // 'ENG', 'HIN', etc.
  isActive: boolean;
  showDate: string;
  seatLayout: Seat[];
  screenId: string;
  createdAt: number;
  deletedAt: null | number;
  pricePerLayout: PriceLayout[];
  theatreId: string;
  statusCode: string;
  updatedAt: number;
  id: string;
}

// Response for showtimes list
export interface ShowtimesListResponse {
  success: boolean;
  message: Array<any> | null;
  data: Showtime[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Response for showtime detail
export interface ShowtimeDetailResponse {
  success: boolean;
  message: string;
  data: ShowtimeDetail;
  timestamp: string;
}

/** Seat line inside POST /public/showtimes/:id/bookings payload */
export interface PublicBookingSeatDetail {
  seatName: string;
  row: string;
  col: number;
  seatCode: string;
  seatPrice: number;
  seatStatusCode: number;
}

/** One booking aggregate for a showtime (may be in progress or completed) */
export interface PublicShowtimeBooking {
  paymentStatus: string;
  bookingDetails: PublicBookingSeatDetail[];
  createdAt: number[] | string;
}

export interface PublicShowtimeBookingsResponse {
  success: boolean;
  message: string;
  data: PublicShowtimeBooking[];
  timestamp?: string;
}

// Movie interface - matches API response structure
export interface Movie {
  id: string;
  title: string;
  poster: string; // API field name
  banner?: string; // API field name
  duration: number; // in minutes
  releaseDate: string; // ISO format YYYY-MM-DD
  status: string; // API returns COMING_SOON, NOW_SHOWING, etc.
  genres: Genre[]; // Array of genre objects, not strings
  // Optional fields from detail API
  description?: string; // Plot synopsis
  trailerUrl?: string; // YouTube or video URL (empty if not available)
  language?: string[]; // Array of language codes like ENG, HIN
  country?: string;
  certification?: string; // U, UA, A, R
  formats?: string[]; // 2D, 3D, IMAX, 4DX
  starcast?: StarCast[]; // Array of cast members
  isActive?: boolean;
}

// Response wrapper for list API
export interface MovieListResponse {
  success: boolean;
  message: string;
  data: Movie[];
  // Pagination fields at root level (actual API structure)
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Response wrapper for detail API
export interface MovieDetailResponse {
  success: boolean;
  message: string;
  data: Movie;
  timestamp: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  facilities: string[];
}

// Response for seat types API
export interface SeatTypesResponse {
  success: boolean;
  message: string;
  data: SeatType[];
}
