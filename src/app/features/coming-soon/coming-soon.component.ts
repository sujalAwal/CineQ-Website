import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="min-h-screen bg-dark-950 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-display font-bold text-white mb-2">Coming Soon</h1>
          <p class="text-gray-400">Get ready for the most anticipated releases</p>
        </div>

        <!-- Movie Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (movie of movieService.comingSoonMovies(); track movie.id) {
            <app-movie-card [movie]="movie"></app-movie-card>
          } @empty {
            <div class="col-span-full text-center py-12">
              <div class="w-20 h-20 mx-auto mb-4 bg-dark-800 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <p class="text-gray-400">No upcoming movies at the moment</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ComingSoonComponent {
  movieService = inject(MovieService);
}
