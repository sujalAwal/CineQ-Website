import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie, MovieListResponse, MovieDetailResponse, Genre } from '../models/movie.model';
import { environment } from '../../../environments/environment';
import { MasterDataService } from './master-data.service';

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
}
