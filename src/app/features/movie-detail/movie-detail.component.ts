import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../core/services/movie.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import { Movie, Showtime } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  template: `
    @if (movie()) {
      <!-- Hero Section with Backdrop -->
      <section class="relative min-h-[60vh] md:min-h-[70vh]">
        <!-- Background -->
        <div class="absolute inset-0">
          <img [src]="movie()!.backdropUrl" 
               [alt]="movie()!.title"
               class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/90 to-dark-950/50"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/50"></div>
        </div>

        <!-- Content -->
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <!-- Breadcrumb -->
          <nav class="mb-8 animate-fade-in">
            <ol class="flex items-center space-x-2 text-sm">
              <li><a routerLink="/" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><span class="text-gray-600">/</span></li>
              <li><a routerLink="/movies" class="text-gray-400 hover:text-white transition-colors">Movies</a></li>
              <li><span class="text-gray-600">/</span></li>
              <li><span class="text-primary-400">{{ movie()!.title }}</span></li>
            </ol>
          </nav>

          <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <!-- Poster -->
            <div class="flex-shrink-0 animate-slide-up">
              <div class="relative w-64 md:w-80 mx-auto lg:mx-0">
                <img [src]="movie()!.posterUrl" 
                     [alt]="movie()!.title"
                     class="w-full rounded-2xl shadow-2xl">
                <!-- Rating Badge -->
                @if (movie()!.rating > 0) {
                  <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-dark-900 px-4 py-2 rounded-full border border-dark-700">
                    <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-lg font-bold text-white">{{ movie()!.rating.toFixed(1) }}</span>
                    <span class="text-sm text-gray-400">/10</span>
                  </div>
                }
              </div>
            </div>

            <!-- Movie Info -->
            <div class="flex-1 animate-slide-up" style="animation-delay: 100ms">
              <!-- Status Badge -->
              @if (movie()!.status === 'coming-soon') {
                <span class="inline-block px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
                  Coming Soon
                </span>
              } @else {
                <span class="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                  Now Showing
                </span>
              }

              <h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                {{ movie()!.title }}
              </h1>

              <p class="text-xl text-gray-300 mb-6">{{ movie()!.tagline }}</p>

              <!-- Meta Info -->
              <div class="flex flex-wrap items-center gap-4 mb-6 text-gray-400">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ formatDuration(movie()!.duration) }}</span>
                </div>
                <span class="text-dark-600">•</span>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>{{ formatDate(movie()!.releaseDate) }}</span>
                </div>
                <span class="text-dark-600">•</span>
                <span>{{ movie()!.language }}</span>
              </div>

              <!-- Genres -->
              <div class="flex flex-wrap gap-2 mb-6">
                @for (genre of movie()!.genres; track genre) {
                  <span class="badge badge-primary px-3 py-1">{{ genre }}</span>
                }
              </div>

              <!-- Synopsis -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-white mb-2">Synopsis</h3>
                <p class="text-gray-300 leading-relaxed">{{ movie()!.synopsis }}</p>
              </div>

              <!-- Director -->
              <div class="mb-6">
                <span class="text-gray-400">Director:</span>
                <span class="text-white ml-2">{{ movie()!.director }}</span>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-4">
                @if (movie()!.status === 'now-showing') {
                  <button (click)="bookTicket()" class="btn-primary py-3 px-8 text-lg inline-flex items-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                    </svg>
                    <span>Book Tickets</span>
                  </button>
                } @else {
                  <button class="btn-secondary py-3 px-8 text-lg inline-flex items-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span>Notify Me</span>
                  </button>
                }
                <button (click)="toggleTrailer()" class="btn-ghost py-3 px-6 inline-flex items-center space-x-2 border border-dark-600">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trailer Modal -->
      @if (showTrailer()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" (click)="toggleTrailer()">
          <div class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-5xl aspect-video bg-dark-900 rounded-xl overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
            <button (click)="toggleTrailer()" 
                    class="absolute -top-12 right-0 p-2 text-white hover:text-primary-400 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <iframe [src]="safeTrailerUrl()" 
                    class="w-full h-full"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
          </div>
        </div>
      }

      <!-- Cast Section -->
      @if (movie()!.cast.length > 0) {
        <section class="py-12 bg-dark-950">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title flex items-center space-x-3">
              <span class="w-1 h-8 bg-primary-500 rounded-full"></span>
              <span>Cast</span>
            </h2>

            <div class="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              @for (actor of movie()!.cast; track actor.id) {
                <div class="flex-shrink-0 w-32 text-center">
                  <div class="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-dark-800">
                    <img [src]="actor.imageUrl" 
                         [alt]="actor.name"
                         class="w-full h-full object-cover"
                         loading="lazy">
                  </div>
                  <h4 class="text-white font-medium text-sm truncate">{{ actor.name }}</h4>
                  <p class="text-gray-400 text-xs truncate">{{ actor.character }}</p>
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- Showtimes Section -->
      @if (movie()!.status === 'now-showing' && movie()!.showtimes.length > 0) {
        <section class="py-12 bg-dark-900">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title flex items-center space-x-3">
              <span class="w-1 h-8 bg-accent-500 rounded-full"></span>
              <span>Showtimes</span>
            </h2>

            <!-- Date Selector -->
            <div class="flex space-x-3 mb-6 overflow-x-auto pb-2">
              @for (date of dateOptions; track date.value; let i = $index) {
                <button (click)="selectDate(i)"
                        class="flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all duration-300"
                        [class.bg-primary-500]="selectedDateIndex() === i"
                        [class.text-white]="selectedDateIndex() === i"
                        [class.bg-dark-800]="selectedDateIndex() !== i"
                        [class.text-gray-300]="selectedDateIndex() !== i"
                        [class.hover:bg-dark-700]="selectedDateIndex() !== i">
                  <div class="text-xs uppercase">{{ date.day }}</div>
                  <div class="text-lg font-semibold">{{ date.date }}</div>
                </button>
              }
            </div>

            <!-- Showtime Buttons -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              @for (showtime of movie()!.showtimes; track showtime.id) {
                <button (click)="selectShowtime(showtime)"
                        [disabled]="!showtime.available"
                        class="card p-4 text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        [class.border-primary-500]="selectedShowtime()?.id === showtime.id"
                        [class.bg-primary-500/10]="selectedShowtime()?.id === showtime.id">
                  <div class="text-lg font-semibold text-white">{{ showtime.time }}</div>
                  <div class="text-sm text-gray-400">{{ showtime.theater }}</div>
                  <div class="text-primary-400 font-medium mt-1">₹{{ showtime.price }}</div>
                  @if (!showtime.available) {
                    <span class="text-xs text-red-400 mt-1 block">Sold Out</span>
                  }
                </button>
              }
            </div>

            <!-- Book Button -->
            @if (selectedShowtime()) {
              <div class="mt-8 text-center">
                <button (click)="proceedToBooking()" class="btn-primary py-3 px-12 text-lg">
                  Continue to Seat Selection
                </button>
              </div>
            }
          </div>
        </section>
      }

      <!-- Related Movies -->
      @if (relatedMovies().length > 0) {
        <section class="py-12 bg-dark-950">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title flex items-center space-x-3">
              <span class="w-1 h-8 bg-primary-500 rounded-full"></span>
              <span>You May Also Like</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (movie of relatedMovies(); track movie.id) {
                <app-movie-card [movie]="movie"></app-movie-card>
              }
            </div>
          </div>
        </section>
      }
    } @else {
      <!-- Loading State -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private toastService = inject(ToastService);

  movie = signal<Movie | null>(null);
  relatedMovies = signal<Movie[]>([]);
  showTrailer = signal(false);
  selectedShowtime = signal<Showtime | null>(null);
  selectedDateIndex = signal(0);

  dateOptions = this.generateDateOptions();

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      const movie = this.movieService.getMovieById(movieId);
      
      if (movie) {
        this.movie.set(movie);
        this.relatedMovies.set(this.movieService.getRelatedMovies(movieId, 4));
        this.selectedShowtime.set(null);
      } else {
        this.router.navigate(['/']);
        this.toastService.error('Movie not found');
      }
    });
  }

  private generateDateOptions(): { day: string; date: string; value: Date }[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const options = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      options.push({
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[date.getDay()],
        date: date.getDate().toString(),
        value: date
      });
    }
    
    return options;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  }

  safeTrailerUrl(): SafeResourceUrl {
    const movie = this.movie();
    if (!movie) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(movie.trailer + '?autoplay=1');
  }

  toggleTrailer(): void {
    this.showTrailer.update(v => !v);
  }

  selectDate(index: number): void {
    this.selectedDateIndex.set(index);
    this.selectedShowtime.set(null);
  }

  selectShowtime(showtime: Showtime): void {
    if (showtime.available) {
      this.selectedShowtime.set(showtime);
    }
  }

  bookTicket(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.openLoginModal();
      return;
    }

    // Scroll to showtimes
    const showtimesSection = document.querySelector('section:has(h2:contains("Showtimes"))');
    if (showtimesSection) {
      showtimesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  proceedToBooking(): void {
    const movie = this.movie();
    const showtime = this.selectedShowtime();

    if (!this.authService.isAuthenticated()) {
      this.authService.openLoginModal();
      return;
    }

    if (movie && showtime) {
      this.bookingService.initBooking(movie, showtime);
      this.router.navigate(['/booking', movie.id]);
    }
  }
}
