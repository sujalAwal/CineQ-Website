import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieService, mergePublicBookingsIntoSeatLayout } from '../../core/services/movie.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import {
  Movie,
  MovieDetailResponse,
  Showtime,
  ShowtimeDetail,
  Seat,
  SeatType,
  PublicShowtimeBookingsResponse
} from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  template: `
    @if (loading()) {
      <div class="min-h-screen bg-dark-950 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    } @else if (error()) {
      <div class="min-h-screen bg-dark-950 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2m0-12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-400">{{ error() }}</p>
        </div>
      </div>
    } @else if (movie()) {
      <!-- Hero Section with Backdrop -->
      <section class="relative min-h-[60vh] md:min-h-[70vh] bg-dark-950">
        <!-- Background -->
        <div class="absolute inset-0">
          @if (movie()?.banner) {
            <img [src]="movie()!.banner" 
                 [alt]="movie()!.title"
                 class="w-full h-full object-cover">
          } @else {
            <img [src]="movie()!.poster" 
                 [alt]="movie()!.title"
                 class="w-full h-full object-cover">
          }
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
                <img [src]="movie()!.poster" 
                     [alt]="movie()!.title"
                     class="w-full rounded-2xl shadow-2xl">
              </div>
            </div>

            <!-- Movie Info -->
            <div class="flex-1 animate-slide-up" style="animation-delay: 100ms">
              <!-- Status Badge -->
              @if (movie()!.status === 'COMING_SOON') {
                <span class="inline-block px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
                  Coming Soon
                </span>
              } @else if (movie()!.status === 'NOW_SHOWING') {
                <span class="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                  Now Showing
                </span>
              } @else {
                <span class="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
                  {{ movie()!.status }}
                </span>
              }

              <h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                {{ movie()!.title }}
              </h1>

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
                @if (movie()?.language?.length) {
                  <span class="text-dark-600">•</span>
                  <span>{{ movie()?.language?.join(', ') }}</span>
                }
              </div>

              <!-- Additional Info -->
              <div class="space-y-2 mb-6 text-gray-300">
                @if (movie()?.country) {
                  <div>
                    <span class="text-gray-400">Country:</span>
                    <span class="ml-2">{{ movie()!.country }}</span>
                  </div>
                }
                @if (movie()?.certification) {
                  <div>
                    <span class="text-gray-400">Certification:</span>
                    <span class="ml-2 badge badge-primary">{{ movie()!.certification }}</span>
                  </div>
                }
                @if (movie()?.formats?.length) {
                  <div>
                    <span class="text-gray-400">Formats:</span>
                    <span class="ml-2">{{ movie()?.formats?.join(', ') }}</span>
                  </div>
                }
              </div>

              <!-- Genres -->
              <div class="flex flex-wrap gap-2 mb-6">
                @for (genre of movie()!.genres; track genre.id) {
                  <span class="badge badge-primary px-3 py-1">{{ genre.name }}</span>
                }
              </div>

              <!-- Description -->
              @if (movie()?.description) {
                <div class="mb-8">
                  <h3 class="text-lg font-semibold text-white mb-2">Synopsis</h3>
                  <p class="text-gray-300 leading-relaxed">{{ movie()!.description }}</p>
                </div>
              }

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-4">
                @if (movie()!.status === 'NOW_SHOWING') {
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
                @if (hasTrailer()) {
                  <button (click)="toggleTrailer()" class="btn-ghost py-3 px-6 inline-flex items-center space-x-2 border border-dark-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                    <span>Watch Trailer</span>
                  </button>
                }
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
                    class="absolute -top-12 right-0 p-2 text-white hover:text-primary-400 transition-colors z-10">
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
      @if (movie()?.starcast?.length) {
        <section class="py-12 bg-dark-950">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title flex items-center space-x-3">
              <span class="w-1 h-8 bg-primary-500 rounded-full"></span>
              <span>Cast</span>
            </h2>

            <div class="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              @for (cast of movie()!.starcast; track cast.artistId) {
                <div class="flex-shrink-0 w-32 text-center">
                  <!-- Avatar Circle -->
                  <div class="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-dark-800 border-2 border-primary-500/30">
                    @if (cast.artist.avatar?.trim()) {
                      <img [src]="cast.artist.avatar" 
                           [alt]="cast.artist.fullName" 
                           class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    }
                  </div>
                  
                  <!-- Actor Name -->
                  <h4 class="text-white font-medium text-sm truncate mb-1">{{ cast.artist.fullName }}</h4>
                  
                  <!-- Character Name or Role -->
                  @if (cast.characterName && cast.characterName.trim() !== '') {
                    <p class="text-primary-400 text-xs truncate mb-2">{{ cast.characterName }}</p>
                  } @else {
                    <p class="text-gray-400 text-xs truncate mb-2">Cast Member</p>
                  }
                  
                  <!-- Bottom Badge - Artist Type Full Name -->
                  @if (cast.artistType) {
                    <span class="inline-block px-2.5 py-1 bg-primary-500/30 text-primary-300 text-xs rounded-full border border-primary-500/50 font-medium">
                      {{ cast.artistType.name }}
                    </span>
                  }
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- Showtimes Section -->
      @if (movie()!.status === 'NOW_SHOWING' && showtimes().length > 0) {
        <section class="py-12 bg-dark-950 border-t border-dark-800">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title flex items-center space-x-3 mb-8">
              <span class="w-1 h-8 bg-primary-500 rounded-full"></span>
              <span>Book Your Tickets</span>
            </h2>

            @if (showsLoading()) {
              <div class="flex justify-center py-8">
                <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            } @else {
              <div class="space-y-8">
                <!-- Step 1: Select Date -->
                <div>
                  <h3 class="text-lg font-semibold text-white mb-4">Step 1: Choose Date</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    @for (date of uniqueDates(); track date) {
                      <button 
                        (click)="selectDate(date)"
                        class="p-3 rounded-lg border transition-all bg-dark-800/50"
                        [class.border-2]="selectedDate() === date"
                        [class.border-primary-500]="selectedDate() === date"
                        [class.border]="selectedDate() !== date"
                        [class.border-dark-700]="selectedDate() !== date"
                        [class.hover:border-primary-500]="selectedDate() !== date"
                      >
                        <p class="text-sm font-medium text-white">{{ formatDate(date) }}</p>
                      </button>
                    }
                  </div>
                </div>

                <!-- Step 2: Select Theater (shows if date is selected) -->
                @if (selectedDate()) {
                  <div>
                    <h3 class="text-lg font-semibold text-white mb-4">Step 2: Choose Theater</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      @for (theater of theatersForSelectedDate(); track theater.id) {
                        <button 
                          (click)="selectTheater(theater.id)"
                          class="p-3 rounded-lg border transition-all bg-dark-800/50"
                          [class.border-2]="selectedTheater() === theater.id"
                          [class.border-primary-500]="selectedTheater() === theater.id"
                          [class.border]="selectedTheater() !== theater.id"
                          [class.border-dark-700]="selectedTheater() !== theater.id"
                          [class.hover:border-primary-500]="selectedTheater() !== theater.id"
                          [class.text-white]="selectedTheater() === theater.id"
                          [class.text-gray-300]="selectedTheater() !== theater.id"
                        >
                          <p class="text-sm font-medium">{{ theater.name }}</p>
                        </button>
                      }
                    </div>
                  </div>
                }

                <!-- Step 3: Select Screen (shows if theater is selected) -->
                @if (selectedTheater()) {
                  <div>
                    <h3 class="text-lg font-semibold text-white mb-4">Step 3: Choose Screen & Showtime</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      @for (screen of screensForSelectedTheater(); track screen.id) {
                        <button 
                          (click)="selectScreen(screen)"
                          class="p-3 rounded-lg border transition-all bg-dark-800/50"
                          [class.border-2]="selectedScreen()?.id === screen.id"
                          [class.border-primary-500]="selectedScreen()?.id === screen.id"
                          [class.border]="selectedScreen()?.id !== screen.id"
                          [class.border-dark-700]="selectedScreen()?.id !== screen.id"
                          [class.hover:border-primary-500]="selectedScreen()?.id !== screen.id"
                          [class.text-white]="selectedScreen()?.id === screen.id"
                          [class.text-gray-300]="selectedScreen()?.id !== screen.id"
                        >
                          <div class="text-center">
                            <p class="text-xs text-white mb-1">{{ screen.screen.title }}</p>
                            <p class="text-base font-bold">{{ screen.showTime }}</p>
                          </div>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </section>

        <!-- Seat Layout Section -->
        @if (selectedScreen()) {
          <section class="py-12 bg-dark-900 border-t border-dark-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="section-title flex items-center space-x-3 mb-8">
                <span class="w-1 h-8 bg-primary-500 rounded-full"></span>
                <span>Select Your Seats</span>
              </h2>

              @if (seatsLoading()) {
                <div class="flex justify-center py-12">
                  <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              } @else if (seatLayout()) {
                <div class="space-y-8">
                  <!-- Showtime Details -->
                  <div class="bg-dark-800/50 p-4 rounded-lg border border-dark-700">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p class="text-gray-400">Format</p>
                        <p class="font-semibold text-white">{{ seatLayout()!.format }}</p>
                      </div>
                      <div>
                        <p class="text-gray-400">Language</p>
                        <p class="font-semibold text-white">{{ seatLayout()!.language }}</p>
                      </div>
                      <div>
                        <p class="text-gray-400">Time</p>
                        <p class="font-semibold text-white">{{ seatLayout()!.showTime }}</p>
                      </div>
                      <div>
                        <p class="text-gray-400">Screen</p>
                        <p class="font-semibold text-white">{{ selectedScreen()!.screen.title }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Legend -->
                  <div class="flex flex-wrap gap-6 justify-center">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 bg-green-600 rounded border border-green-500 flex items-center justify-center">
                        <span class="text-white text-xs font-bold">V</span>
                      </div>
                      <span class="text-sm text-gray-300">Available</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 bg-gray-600 rounded border border-gray-500 flex items-center justify-center">
                        <span class="text-white text-xs font-bold">X</span>
                      </div>
                      <span class="text-sm text-gray-300">Not Available</span>
                    </div>
                  </div>

                  <!-- Seat Layout Grid -->
                  <div class="overflow-x-auto">
                    <div class="inline-block min-w-full bg-dark-800/30 p-6 rounded-lg">
                      <!-- Screen -->
                      <div class="cinema-screen">
                        <div class="cinema-screen__ambient" aria-hidden="true"></div>
                        <div class="cinema-screen__hull">
                          <div class="cinema-screen__surface" aria-hidden="true"></div>
                          <div class="cinema-screen__spill" aria-hidden="true"></div>
                          <p class="cinema-screen__caption">Screen</p>
                        </div>
                      </div>

                      <!-- Seats Grid -->
                      <div class="space-y-2">
                        @for (seatRow of getSeatRows(); track seatRow[0]?.row) {
                          <div class="flex justify-center gap-2">
                            <!-- Row Label -->
                            <div class="w-6 flex items-center justify-center text-xs font-bold text-gray-500">
                              {{ seatRow[0]?.row }}
                            </div>

                            <!-- Seats in Row -->
                            @for (seat of seatRow; track seat.seatName) {
                              @if (getSeatTypeByCode(seat.code); as seatType) {
                                <button
                                  (click)="toggleSeatSelection(seat.seatName, seat.code)"
                                  [disabled]="seat.code === 'X'"
                                  [class.opacity-50]="seat.code === 'X'"
                                  [class.cursor-not-allowed]="seat.code === 'X'"
                                  [class.ring-4]="isSeatSelected(seat.seatName)"
                                  [class.ring-red-500]="isSeatSelected(seat.seatName)"
                                  [class.scale-125]="isSeatSelected(seat.seatName)"
                                  class="w-8 h-8 rounded text-xs font-bold transition-all hover:scale-110 active:scale-95 text-white border origin-center"
                                  [style.background-color]="seatType.color"
                                  [style.border-color]="seatType.color"
                                  [attr.title]="getSeatTooltip(seat)"
                                  [attr.aria-label]="getSeatAriaLabel(seat)"
                                >
                                  {{ getSeatCellLabel(seat) }}
                                </button>
                              }
                            }

                            <!-- Row Label (End) -->
                            <div class="w-6 flex items-center justify-center text-xs font-bold text-gray-500">
                              {{ seatRow[0]?.row }}
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  <!-- Price Information -->
                  @if (seatLayout()!.pricePerLayout.length) {
                    <div class="bg-dark-800/50 p-4 rounded-lg border border-dark-700">
                      <p class="text-sm font-semibold text-gray-300 mb-3">Price Guide:</p>
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        @for (price of seatLayout()!.pricePerLayout; track price.code) {
                          @if (getSeatTypeByCode(price.code); as seatType) {
                            <div class="flex items-center space-x-2">
                              <div class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                                [style.background-color]="seatType.color"
                              >
                                {{ seatType.code }}
                              </div>
                              <div class="flex flex-col">
                                <span class="text-gray-200 font-medium">{{ seatType.name }}</span>
                                <span class="text-gray-400">₹{{ price.basePrice }}</span>
                              </div>
                            </div>
                          }
                        }
                      </div>
                    </div>
                  }

                  <!-- Selected Seats Section -->
                  @if (selectedSeats().length > 0) {
                    <div class="bg-dark-800/50 p-4 rounded-lg border border-primary-500/30">
                      <p class="text-sm font-semibold text-gray-300 mb-3">Selected Seats ({{ selectedSeats().length }}):</p>
                      <div class="flex flex-wrap gap-2">
                        @for (seatName of selectedSeats(); track seatName) {
                          @if (getSeatTypeByCode(getSelectedSeatCode(seatName)); as seatType) {
                            <div class="flex items-center space-x-2 bg-dark-700 px-3 py-1 rounded-full border border-primary-500/50">
                              <div class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white"
                                [style.background-color]="seatType.color"
                              >
                                {{ seatType.code }}
                              </div>
                              <span class="text-gray-200 text-sm font-medium">{{ seatName }}</span>
                              <button 
                                (click)="toggleSeatSelection(seatName, 'P')"
                                type="button"
                                class="ml-1 text-gray-400 hover:text-red-400 transition-colors"
                                title="Remove seat"
                              >
                                ✕
                              </button>
                            </div>
                          }
                        }
                      </div>
                    </div>
                  }

                  <!-- Book Button -->
                  <div class="text-center">
                    <button 
                      (click)="continueToBooking()"
                      [disabled]="selectedSeats().length === 0 || !movie()"
                      class="btn-primary py-3 px-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Booking
                    </button>
                  </div>
                </div>
              }
            </div>
          </section>
        }
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
              @for (relatedMovie of relatedMovies(); track relatedMovie.id) {
                <app-movie-card [movie]="relatedMovie"></app-movie-card>
              }
            </div>
          </div>
        </section>
      }
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
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private toastService = inject(ToastService);

  // Expose Math to template
  protected readonly Math = Math;

  movie = signal<Movie | null>(null);
  relatedMovies = signal<Movie[]>([]);
  showTrailer = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  showtimes = signal<Showtime[]>([]);
  showsLoading = signal(false);
  selectedDate = signal<string | null>(null);
  selectedTheater = signal<string | null>(null);
  selectedScreen = signal<Showtime | null>(null);
  seatLayout = signal<ShowtimeDetail | null>(null);
  seatTypes = signal<SeatType[]>([]);
  selectedSeats = signal<string[]>([]);
  seatsLoading = signal(false);

  // Computed: Get unique dates from showtimes
  uniqueDates = computed(() => {
    const dates = new Set<string>();
    this.showtimes().forEach(s => dates.add(s.showDate));
    return Array.from(dates).sort();
  });

  // Computed: Get unique theaters for selected date
  theatersForSelectedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return [];
    
    const theaters = new Map<string, { id: string; name: string }>();
    this.showtimes()
      .filter(s => s.showDate === date)
      .forEach(s => {
        if (!theaters.has(s.theater.id)) {
          theaters.set(s.theater.id, { id: s.theater.id, name: s.theater.name });
        }
      });
    
    return Array.from(theaters.values());
  });

  // Computed: Get unique screens for selected date and theater
  screensForSelectedTheater = computed(() => {
    const date = this.selectedDate();
    const theaterId = this.selectedTheater();
    if (!date || !theaterId) return [];
    
    const screens = new Map<string, Showtime>();
    this.showtimes()
      .filter(s => s.showDate === date && s.theater.id === theaterId)
      .forEach(s => {
        const key = s.screen.id;
        if (!screens.has(key)) {
          screens.set(key, s);
        }
      });
    
    return Array.from(screens.values());
  });

  ngOnInit(): void {
    // Load seat types on component init
    this.loadSeatTypes();
    
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.loadMovieDetails(movieId);
      }
    });
  }

  private loadMovieDetails(movieId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<MovieDetailResponse>(`${environment.api.baseUrl}/public/movies/${movieId}`)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.movie.set(response.data);
            // Fetch showtimes for this movie
            this.loadShowtimes(movieId);
            // TODO: Implement related movies from a dedicated API endpoint
            // For now, related movies functionality is disabled
          } else {
            this.error.set('Movie details not found');
            setTimeout(() => this.router.navigate(['/']), 2000);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading movie details:', err);
          this.error.set('Failed to load movie details');
          this.loading.set(false);
        }
      });
  }

  private async loadShowtimes(movieId: string): Promise<void> {
    this.showsLoading.set(true);

    try {
      const response = await this.movieService.getShowtimesForMovie(movieId);
      if (response.data && response.data.length > 0) {
        this.showtimes.set(response.data);
      }
    } catch (err) {
      // Only log to console, don't show error to user
      console.error('Error loading showtimes:', err);
    } finally {
      this.showsLoading.set(false);
    }
  }

  private async loadSeatLayout(showtimeId: string): Promise<void> {
    this.seatsLoading.set(true);

    try {
      const [detailRes, bookingsRes] = await Promise.all([
        this.movieService.getShowtimeDetail(showtimeId),
        this.movieService.getShowtimePublicBookings(showtimeId).catch((e) => {
          console.warn('Showtime bookings overlay skipped:', e);
          return { success: true, message: '', data: [] } as PublicShowtimeBookingsResponse;
        })
      ]);

      if (detailRes.data) {
        const merged = mergePublicBookingsIntoSeatLayout(
          detailRes.data,
          bookingsRes.data
        );
        this.seatLayout.set(merged);

        const blocked = new Set(
          merged.seatLayout.filter(s => s.code === 'X').map(s => s.seatName)
        );
        const before = this.selectedSeats();
        this.selectedSeats.update(sel => sel.filter(s => !blocked.has(s)));
        const removed = before.filter(s => !this.selectedSeats().includes(s));
        if (removed.length) {
          this.toastService.warning(
            'Seats no longer available',
            `${removed.join(', ')} — pick different seats.`
          );
        }
      }
    } catch (err) {
      console.error('Error loading seat layout:', err);
    } finally {
      this.seatsLoading.set(false);
    }
  }

  private async loadSeatTypes(): Promise<void> {
    try {
      const response = await this.movieService.getSeatTypes();
      if (response.data && response.data.length > 0) {
        this.seatTypes.set(response.data);
      }
    } catch (err) {
      // Only log to console, don't show error to user
      console.error('Error loading seat types:', err);
    }
  }

  selectDate(date: string): void {
    this.selectedDate.set(date);
    this.selectedTheater.set(null);
    this.selectedScreen.set(null);
    this.seatLayout.set(null);
  }

  selectTheater(theaterId: string): void {
    this.selectedTheater.set(theaterId);
    this.selectedScreen.set(null);
    this.seatLayout.set(null);
  }

  selectScreen(showtime: Showtime): void {
    this.selectedScreen.set(showtime);
    this.seatLayout.set(null);
    this.selectedSeats.set([]); // Reset selected seats for new screen
    this.loadSeatLayout(showtime.id);
  }

  toggleSeatSelection(seatName: string, code: string): void {
    if (code === 'X') return; // Can't select unavailable seats
    
    this.selectedSeats.update(seats => {
      const index = seats.indexOf(seatName);
      if (index === -1) {
        return [...seats, seatName].sort();
      } else {
        return seats.filter(s => s !== seatName);
      }
    });
  }

  isSeatSelected(seatName: string): boolean {
    return this.selectedSeats().includes(seatName);
  }

  /** Unavailable cells show × (matches legend); avoids repeating seat id on blocked seats. */
  getSeatCellLabel(seat: Seat): string {
    return seat.code === 'X' ? '×' : seat.seatName;
  }

  /** Hover text: blocked seats — row only, no seat name (reduces confusion). */
  getSeatTooltip(seat: Seat): string {
    if (seat.code === 'X') {
      return `Not available — row ${seat.row}`;
    }
    const seatType = this.getSeatTypeByCode(seat.code);
    return `₹${seat.price} — ${seat.seatName} (${seatType?.name ?? seat.code})`;
  }

  getSeatAriaLabel(seat: Seat): string {
    if (seat.code === 'X') {
      return `Unavailable, row ${seat.row}`;
    }
    const seatType = this.getSeatTypeByCode(seat.code);
    return `Seat ${seat.seatName}, ${seatType?.name ?? seat.code}, ₹${seat.price}. Tap to toggle.`;
  }

  getSeatRows(): Seat[][] {
    const layout = this.seatLayout();
    if (!layout || !layout.seatLayout || layout.seatLayout.length === 0) {
      return [];
    }

    // Group seats by row
    const rowMap = new Map<string, Seat[]>();
    layout.seatLayout.forEach(seat => {
      if (!rowMap.has(seat.row)) {
        rowMap.set(seat.row, []);
      }
      rowMap.get(seat.row)!.push(seat);
    });

    // Sort rows alphabetically and seats by column
    return Array.from(rowMap.values())
      .sort((a, b) => {
        const rowA = a[0]?.row || '';
        const rowB = b[0]?.row || '';
        return rowA.localeCompare(rowB);
      })
      .map(row => row.sort((a, b) => a.col - b.col));
  }

  getSeatTypeByCode(code: string): SeatType | undefined {
    return this.seatTypes().find(st => st.code === code);
  }

  getSelectedSeatCode(seatName: string): string {
    const layout = this.seatLayout();
    if (!layout || !layout.seatLayout) return 'X';
    const seat = layout.seatLayout.find(s => s.seatName === seatName);
    return seat?.code || 'X';
  }

  hasTrailer(): boolean {
    const movie = this.movie();
    return !!(movie?.trailerUrl && movie.trailerUrl.trim() !== '');
  }

  safeTrailerUrl(): SafeResourceUrl {
    const movie = this.movie();
    if (!movie?.trailerUrl) return '';
    
    let trailerUrl = movie.trailerUrl;
    // Handle YouTube URLs - convert to embed format
    if (trailerUrl.includes('youtube.com') || trailerUrl.includes('youtu.be')) {
      if (!trailerUrl.includes('embed')) {
        const videoId = trailerUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
        if (videoId) {
          trailerUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
      }
    }
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(trailerUrl);
  }

  toggleTrailer(): void {
    if (this.hasTrailer()) {
      this.showTrailer.update(v => !v);
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  }

  bookTicket(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.openLoginModal();
      return;
    }

    const movie = this.movie();
    if (movie && movie.status === 'NOW_SHOWING') {
      this.toastService.info('Booking', 'Booking feature coming soon');
    }
  }

  continueToBooking(): void {
    // Validate prerequisites
    if (!this.authService.isAuthenticated()) {
      this.authService.openLoginModal();
      return;
    }

    const selectedSeats = this.selectedSeats();
    const selectedScreen = this.selectedScreen();
    const movie = this.movie();

    if (!selectedSeats.length || !selectedScreen || !movie) {
      this.toastService.error('Error', 'Please select at least one seat');
      return;
    }

    // Store booking data in service
    this.bookingService.initBooking(movie, selectedScreen);
    
    // Convert seatNames to BookingSeat format for the service
    const bookingSeats = selectedSeats.map(seatName => {
      const seat = this.seatLayout()?.seatLayout.find(s => s.seatName === seatName);
      // Parse seatName to extract row and col (e.g., 'A1' -> row: 'A', col: 1)
      const row = seat?.row || seatName.charAt(0);
      const number = seat?.col || parseInt(seatName.substring(1), 10) || 1;
      
      // Map seat code to BookingSeat type
      let seatType: 'standard' | 'premium' | 'vip' = 'standard';
      if (seat?.code === 'V') seatType = 'vip';
      else if (seat?.code === 'P') seatType = 'premium';
      else seatType = 'standard';
      
      return {
        id: seatName,
        seatName: seatName,
        row: row,
        number: number,
        type: seatType,
        price: seat?.price || 0,
        isAvailable: true,
        isSelected: true
      };
    });

    // Update the service with selected seats
    this.bookingService.updateSelectedSeats(bookingSeats);

    // Navigate to booking page with data
    this.router.navigate(['/booking', movie.id], {
      state: {
        showtimeId: selectedScreen.id,
        seatNames: selectedSeats,
        screenId: selectedScreen.screen.id,
        movieId: movie.id
      }
    });
  }
}

