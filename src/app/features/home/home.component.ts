import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <!-- Hero Slides -->
      @for (banner of movieService.heroBanners(); track banner.id; let i = $index) {
        <div class="absolute inset-0 transition-opacity duration-1000"
             [class.opacity-100]="currentSlide() === i"
             [class.opacity-0]="currentSlide() !== i">
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img [src]="banner.imageUrl" 
                 [alt]="banner.title"
                 class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/30"></div>
          </div>

          <!-- Content -->
          <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div class="max-w-2xl animate-fade-in">
              <span class="inline-block px-4 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium mb-4">
                Featured Movie
              </span>
              <h1 class="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 text-shadow">
                {{ banner.title }}
              </h1>
              <p class="text-xl md:text-2xl text-gray-300 mb-8">
                {{ banner.tagline }}
              </p>
              <div class="flex flex-wrap gap-4">
                <a [routerLink]="['/movie', banner.movieId]" class="btn-primary py-3 px-8 text-lg inline-flex items-center space-x-2">
                  <span>{{ banner.ctaText }}</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
                <button class="btn-secondary py-3 px-8 text-lg inline-flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Slide Indicators -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        @for (banner of movieService.heroBanners(); track banner.id; let i = $index) {
          <button (click)="goToSlide(i)"
                  class="w-3 h-3 rounded-full transition-all duration-300"
                  [class.bg-primary-500]="currentSlide() === i"
                  [class.w-8]="currentSlide() === i"
                  [class.bg-white/50]="currentSlide() !== i"
                  [attr.aria-label]="'Go to slide ' + (i + 1)">
          </button>
        }
      </div>

      <!-- Navigation Arrows -->
      <button (click)="prevSlide()" 
              class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-colors hidden md:block"
              aria-label="Previous slide">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button (click)="nextSlide()" 
              class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-colors hidden md:block"
              aria-label="Next slide">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </section>

    <!-- Now Showing Section -->
    <section class="py-12 md:py-16 bg-dark-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="section-title flex items-center space-x-3">
              <span class="w-1 h-8 bg-primary-500 rounded-full"></span>
              <span>Now Showing</span>
            </h2>
            <p class="text-gray-400 mt-2">Catch the latest blockbusters in theaters now</p>
          </div>
          <a routerLink="/movies" class="hidden md:flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors font-medium">
            <span>View All</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </a>
        </div>

        <!-- Movie Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (movie of movieService.nowShowingMovies(); track movie.id) {
            <app-movie-card [movie]="movie" class="animate-slide-up" [style.animation-delay]="($index * 100) + 'ms'"></app-movie-card>
          } @empty {
            <!-- Skeleton Loaders -->
            @for (i of [1,2,3,4]; track i) {
              <div class="card animate-pulse">
                <div class="aspect-[2/3] bg-dark-700"></div>
                <div class="p-4 space-y-3">
                  <div class="h-5 bg-dark-700 rounded w-3/4"></div>
                  <div class="h-4 bg-dark-700 rounded w-1/2"></div>
                  <div class="flex gap-2">
                    <div class="h-6 w-16 bg-dark-700 rounded-full"></div>
                    <div class="h-6 w-16 bg-dark-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Mobile View All Button -->
        <div class="mt-8 text-center md:hidden">
          <a routerLink="/movies" class="btn-secondary inline-flex items-center space-x-2">
            <span>View All Movies</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Coming Soon Section -->
    <section class="py-12 md:py-16 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="section-title flex items-center space-x-3">
              <span class="w-1 h-8 bg-accent-500 rounded-full"></span>
              <span>Coming Soon</span>
            </h2>
            <p class="text-gray-400 mt-2">Get ready for the most anticipated releases</p>
          </div>
          <a routerLink="/coming-soon" class="hidden md:flex items-center space-x-2 text-accent-400 hover:text-accent-300 transition-colors font-medium">
            <span>View All</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </a>
        </div>

        <!-- Movie Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (movie of movieService.comingSoonMovies(); track movie.id) {
            <app-movie-card [movie]="movie"></app-movie-card>
          } @empty {
            <p class="text-gray-400 col-span-full text-center py-8">No upcoming movies at the moment.</p>
          }
        </div>

        <!-- Mobile View All Button -->
        <div class="mt-8 text-center md:hidden">
          <a routerLink="/coming-soon" class="btn-secondary inline-flex items-center space-x-2">
            <span>View All Upcoming</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 md:py-16 bg-dark-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="section-title">Why Choose CineQ?</h2>
          <p class="text-gray-400 max-w-2xl mx-auto">Experience the best movie booking platform with premium features designed for movie lovers.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card p-6 text-center group">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary-500/20 rounded-2xl flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
              <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Easy Booking</h3>
            <p class="text-gray-400">Book your tickets in just a few clicks with our intuitive booking system.</p>
          </div>

          <!-- Feature 2 -->
          <div class="card p-6 text-center group">
            <div class="w-16 h-16 mx-auto mb-4 bg-accent-500/20 rounded-2xl flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
              <svg class="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Best Prices</h3>
            <p class="text-gray-400">Get exclusive deals and discounts on your favorite movies.</p>
          </div>

          <!-- Feature 3 -->
          <div class="card p-6 text-center group">
            <div class="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Secure Payments</h3>
            <p class="text-gray-400">Your transactions are protected with industry-standard security.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-12 md:py-16 bg-gradient-to-r from-primary-900/50 to-accent-900/50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="section-title">Stay in the Loop</h2>
        <p class="text-gray-300 mb-8 max-w-2xl mx-auto">Subscribe to our newsletter and never miss out on new releases, exclusive offers, and special screenings.</p>
        
        <form class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input type="email" 
                 placeholder="Enter your email" 
                 class="input-field flex-1">
          <button type="submit" class="btn-primary whitespace-nowrap">
            Subscribe Now
          </button>
        </form>
        
        <p class="mt-4 text-sm text-gray-400">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  movieService = inject(MovieService);
  
  currentSlide = signal(0);
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide(): void {
    const banners = this.movieService.heroBanners();
    this.currentSlide.update(current => (current + 1) % banners.length);
  }

  prevSlide(): void {
    const banners = this.movieService.heroBanners();
    this.currentSlide.update(current => (current - 1 + banners.length) % banners.length);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
