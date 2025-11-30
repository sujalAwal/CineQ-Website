import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="min-h-screen bg-dark-950 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-display font-bold text-white mb-2">Now Showing</h1>
          <p class="text-gray-400">Catch the latest blockbusters in theaters now</p>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button class="badge bg-primary-500 text-white px-4 py-2 font-medium">All</button>
          @for (genre of movieService.getAllGenres(); track genre) {
            <button class="badge bg-dark-800 text-gray-300 hover:bg-dark-700 px-4 py-2 transition-colors">
              {{ genre }}
            </button>
          }
        </div>

        <!-- Movie Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (movie of movieService.nowShowingMovies(); track movie.id) {
            <app-movie-card [movie]="movie"></app-movie-card>
          } @empty {
            <div class="col-span-full text-center py-12">
              <div class="w-20 h-20 mx-auto mb-4 bg-dark-800 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                </svg>
              </div>
              <p class="text-gray-400">No movies currently showing</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MoviesComponent {
  movieService = inject(MovieService);
}
