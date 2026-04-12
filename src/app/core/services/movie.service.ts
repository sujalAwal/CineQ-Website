import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Movie,
  MovieListResponse,
  MovieDetailResponse,
  Genre,
  ShowtimesListResponse,
  ShowtimeDetailResponse,
  ShowtimeDetail,
  SeatTypesResponse,
  PublicShowtimeBookingsResponse,
  PublicShowtimeBooking
} from '../models/movie.model';
import { environment } from '../../../environments/environment';
import { MasterDataService } from './master-data.service';
import { firstValueFrom } from 'rxjs';

/** Block seats from these payment states (held or sold). */
const BOOKING_PAYMENT_BLOCKS_SEAT = new Set(['INITIATED', 'COMPLETED']);

/**
 * Overlay taken / in-progress seats onto layout (code → X). Optionally keep some names selectable (e.g. current checkout).
 */
export function mergePublicBookingsIntoSeatLayout(
  detail: ShowtimeDetail,
  bookings: PublicShowtimeBooking[] | null | undefined,
  exemptSeatNames?: ReadonlySet<string>
): ShowtimeDetail {
  if (!bookings?.length) {
    return detail;
  }
  const blocked = new Set<string>();
  for (const booking of bookings) {
    if (!BOOKING_PAYMENT_BLOCKS_SEAT.has(booking.paymentStatus)) {
      continue;
    }
    for (const line of booking.bookingDetails ?? []) {
      if (line.seatName && !exemptSeatNames?.has(line.seatName)) {
        blocked.add(line.seatName);
      }
    }
  }
  if (blocked.size === 0) {
    return detail;
  }
  return {
    ...detail,
    seatLayout: detail.seatLayout.map(seat =>
      blocked.has(seat.seatName) ? { ...seat, code: 'X' } : seat
    )
  };
}

export interface MovieSection {
  statusCode: string;
  name: string;
  description: string;
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = environment.api.baseUrl;
  private nowShowingSectionSignal = signal<MovieSection>({
    statusCode: 'NOW_SHOWING',
    name: '',
    description: '',
    movies: [],
    loading: false,
    error: null
  });

  private comingSoonSectionSignal = signal<MovieSection>({
    statusCode: 'COMING_SOON',
    name: '',
    description: '',
    movies: [],
    loading: false,
    error: null
  });

  readonly nowShowingSection = this.nowShowingSectionSignal.asReadonly();
  readonly comingSoonSection = this.comingSoonSectionSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private masterDataService: MasterDataService
  ) {
    // Watch for master data changes and update sections when available
    effect(() => {
      const masterData = this.masterDataService.masterData();
      if (masterData) {
        this.initializeSections();
      }
    });

    this.loadMoviesByStatus('NOW_SHOWING');
    this.loadMoviesByStatus('COMING_SOON');
  }

  /**
   * Initialize section metadata from master data
   */
  private initializeSections(): void {
    const nowShowingStatus = this.masterDataService.getStatusByCode('NOW_SHOWING');
    const comingSoonStatus = this.masterDataService.getStatusByCode('COMING_SOON');

    if (nowShowingStatus) {
      this.nowShowingSectionSignal.update(section => ({
        ...section,
        name: nowShowingStatus.name,
        description: nowShowingStatus.description
      }));
    }

    if (comingSoonStatus) {
      this.comingSoonSectionSignal.update(section => ({
        ...section,
        name: comingSoonStatus.name,
        description: comingSoonStatus.description
      }));
    }
  }

  /**
   * Load movies by status code
   */
  private loadMoviesByStatus(statusCode: string): void {
    const section = statusCode === 'NOW_SHOWING' ? this.nowShowingSectionSignal : this.comingSoonSectionSignal;
    
    section.update(s => ({ ...s, loading: true, error: null }));

    const url = `${this.apiUrl}/public/movies?releaseStatus=${statusCode}&size=100`;

    this.http.get<MovieListResponse>(url).subscribe({
      next: (response) => {
        if (response?.success && response?.data) {
          section.update(s => ({
            ...s,
            movies: response.data,
            loading: false,
            error: null
          }));
        } else {
          section.update(s => ({
            ...s,
            loading: false,
            error: response?.message || 'Failed to load movies'
          }));
        }
      },
      error: (err) => {
        console.error(`Error loading ${statusCode} movies:`, err);
        section.update(s => ({
          ...s,
          loading: false,
          error: 'Failed to load movies'
        }));
      }
    });
  }

  /**
   * Get movie by ID from API
   */
  getMovieById(id: string): void {
    this.http
      .get<MovieDetailResponse>(`${this.apiUrl}/public/movies/${id}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Movie details:', response.data);
          }
        },
        error: (err) => {
          console.error('Error loading movie details:', err);
        }
      });
  }

  /**
   * Get all unique genres from all sections
   */
  getAllGenres(): string[] {
    const genres = new Set<string>();
    [...this.nowShowingSectionSignal().movies, ...this.comingSoonSectionSignal().movies].forEach((movie: Movie) => {
      movie.genres?.forEach((genre: Genre) => genres.add(genre.name));
    });
    return Array.from(genres).sort();
  }

  /**
   * Check if a movie has a valid trailer URL
   */
  hasTrailer(movie: Movie): boolean {
    return !!(movie.trailerUrl && movie.trailerUrl.trim() !== '');
  }

  /**
   * Get showtimes for a movie
   */
  getShowtimesForMovie(movieId: string): Promise<ShowtimesListResponse> {
    return this.http
      .get<ShowtimesListResponse>(`${this.apiUrl}/public/showtimes/movie/${movieId}`)
      .toPromise()
      .then((response) => {
        // Check if data exists (API may return success:false but still have data)
        if (response?.data && Array.isArray(response.data)) {
          return response;
        }
        throw new Error('No showtimes available');
      })
      .catch((err) => {
        console.error('Error loading showtimes:', err);
        throw err;
      });
  }

  /**
   * Get seat layout for a specific showtime
   */
  getShowtimeDetail(showtimeId: string): Promise<ShowtimeDetailResponse> {
    return this.http
      .get<ShowtimeDetailResponse>(`${this.apiUrl}/public/showtimes/${showtimeId}`)
      .toPromise()
      .then((response) => {
        if (response?.data) {
          return response;
        }
        throw new Error('Failed to load showtime details');
      })
      .catch((err) => {
        console.error('Error loading showtime details:', err);
        throw err;
      });
  }

  /**
   * Public: seats tied to in-progress or completed payments for this showtime.
   * POST body is empty; same showtime id as GET layout.
   */
  getShowtimePublicBookings(showtimeId: string): Promise<PublicShowtimeBookingsResponse> {
    return firstValueFrom(
      this.http.post<PublicShowtimeBookingsResponse>(
        `${this.apiUrl}/public/showtimes/${showtimeId}/bookings`,
        {}
      )
    ).then((response) => {
      if (response?.success && Array.isArray(response.data)) {
        return response;
      }
      throw new Error(response?.message || 'Failed to load showtime bookings');
    });
  }

  /**
   * Get all seat types
   */
  getSeatTypes(): Promise<SeatTypesResponse> {
    return this.http
      .get<SeatTypesResponse>(`${this.apiUrl}/public/seat-types`)
      .toPromise()
      .then((response) => {
        if (response?.data && Array.isArray(response.data)) {
          return response;
        }
        throw new Error('Failed to load seat types');
      })
      .catch((err) => {
        console.error('Error loading seat types:', err);
        throw err;
      });
  }
}
