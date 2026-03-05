import { Injectable, signal, computed } from '@angular/core';
import { Movie } from '../models/movie.model';
import { MOCK_MOVIES } from '../data/mock-movies';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private moviesSignal = signal<Movie[]>(MOCK_MOVIES);
  private loadingSignal = signal<boolean>(false);

  // Computed signals for different movie categories
  readonly movies = this.moviesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly nowShowingMovies = computed(() => 
    this.moviesSignal().filter(movie => movie.status === 'now-showing')
  );

  readonly comingSoonMovies = computed(() => 
    this.moviesSignal().filter(movie => movie.status === 'coming-soon')
  );

  constructor() {}

  /**
   * Get all movies
   * In future, replace with HTTP call
   */
  getAllMovies(): Movie[] {
    // TODO: Replace with API call
    // return this.http.get<Movie[]>(`${environment.apiUrl}/movies`);
    return this.moviesSignal();
  }

  /**
   * Get movie by ID
   */
  getMovieById(id: string): Movie | undefined {
    // TODO: Replace with API call
    // return this.http.get<Movie>(`${environment.apiUrl}/movies/${id}`);
    return this.moviesSignal().find(movie => movie.id === id);
  }

  /**
   * Get now showing movies
   */
  getNowShowingMovies(): Movie[] {
    return this.nowShowingMovies();
  }

  /**
   * Get coming soon movies
   */
  getComingSoonMovies(): Movie[] {
    return this.comingSoonMovies();
  }

  /**
   * Search movies by title
   */
  searchMovies(query: string): Movie[] {
    if (!query.trim()) {
      return this.moviesSignal();
    }
    const lowerQuery = query.toLowerCase();
    return this.moviesSignal().filter(movie => 
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Filter movies by genre
   */
  filterByGenre(genre: string): Movie[] {
    return this.moviesSignal().filter(movie => 
      movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }

  /**
   * Get all unique genres
   */
  getAllGenres(): string[] {
    const genres = new Set<string>();
    this.moviesSignal().forEach(movie => {
      movie.genres.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }

  /**
   * Get related movies (same genre, excluding current)
   */
  getRelatedMovies(movieId: string, limit: number = 4): Movie[] {
    const movie = this.getMovieById(movieId);
    if (!movie) return [];

    return this.moviesSignal()
      .filter(m => m.id !== movieId && m.genres.some(g => movie.genres.includes(g)))
      .slice(0, limit);
  }
}
