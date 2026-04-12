import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import { BookingDetails } from '../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-950 pt-24 pb-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              My Bookings
            </h1>
            <p class="text-gray-400">View and manage your movie ticket bookings</p>
          </div>
          <a routerLink="/movies" class="mt-4 md:mt-0 btn-primary inline-flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Book New Tickets</span>
          </a>
        </div>

        <!-- Filter Tabs -->
        <div class="flex space-x-2 mb-8 overflow-x-auto pb-2">
          @for (tab of filterTabs; track tab.value) {
            <button
              (click)="setFilter(tab.value)"
              class="px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap"
              [class.bg-primary-600]="activeFilter() === tab.value"
              [class.bg-dark-800]="activeFilter() !== tab.value"
            >
              {{ tab.label }}
              @if (tab.value !== 'all') {
                <span class="ml-1 text-xs opacity-70">({{ getCount(tab.value) }})</span>
              }
            </button>
          }
        </div>

        <!-- Loading skeleton -->
        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1, 2, 3]; track i) {
              <div class="card overflow-hidden animate-pulse">
                <div class="flex flex-col md:flex-row">
                  <div class="w-full md:w-48 h-48 bg-dark-700 flex-shrink-0"></div>
                  <div class="flex-1 p-6 space-y-4">
                    <div class="h-6 bg-dark-700 rounded w-48"></div>
                    <div class="h-4 bg-dark-700 rounded w-32"></div>
                    <div class="grid grid-cols-4 gap-4">
                      <div class="h-14 bg-dark-700 rounded"></div>
                      <div class="h-14 bg-dark-700 rounded"></div>
                      <div class="h-14 bg-dark-700 rounded"></div>
                      <div class="h-14 bg-dark-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Bookings list -->
        @else if (filteredBookings().length > 0) {
          <div class="space-y-4">
            @for (booking of filteredBookings(); track booking.id) {
              <div class="card card-hover overflow-hidden">
                <div class="flex flex-col md:flex-row">

                  <!-- Movie Poster -->
                  <div class="w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-dark-800">
                    <img
                      [src]="booking.movie.poster || ''"
                      [alt]="booking.movie.title"
                      class="w-full h-full object-cover"
                      (error)="onPosterError($event)"
                    >
                  </div>

                  <!-- Booking Details -->
                  <div class="flex-1 p-6">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <div class="flex items-center space-x-3 mb-2">
                          <h3 class="text-xl font-bold text-white">{{ booking.movie.title }}</h3>
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            [ngClass]="{
                              'bg-green-500/20 text-green-400': booking.status === 'confirmed',
                              'bg-yellow-500/20 text-yellow-400': booking.status === 'pending',
                              'bg-red-500/20 text-red-400': booking.status === 'cancelled'
                            }"
                          >
                            {{ booking.status | titlecase }}
                          </span>
                        </div>
                        <p class="text-gray-400 text-sm">Booking Ref: <span class="font-mono text-primary-400">{{ booking.id }}</span></p>
                      </div>

                      <div class="mt-4 md:mt-0 text-right">
                        <p class="text-2xl font-bold text-white">₹{{ booking.grandTotal }}</p>
                        <p class="text-gray-500 text-sm">{{ ticketCount(booking) }} Ticket(s)</p>
                      </div>
                    </div>

                    <!-- Show Info Grid -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Date</p>
                        <p class="text-white font-medium text-sm">
                          {{ formatDate(booking.showtime.date) }}
                        </p>
                      </div>
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Time</p>
                        <p class="text-white font-medium text-sm">{{ booking.showtime.time || '—' }}</p>
                      </div>
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Theater</p>
                        <p class="text-white font-medium text-sm truncate">{{ booking.showtime.theater || '—' }}</p>
                      </div>
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Seats</p>
                        <p class="text-white font-medium text-sm truncate">{{ getSeatNumbers(booking) }}</p>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-wrap items-center gap-3">
                      @if (booking.status === 'confirmed') {
                        <button
                          (click)="viewTicket(booking)"
                          class="btn-primary text-sm flex items-center space-x-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                          </svg>
                          <span>View Ticket</span>
                        </button>
                      }
                      @if (booking.status === 'pending' && booking.expiresAt) {
                        <span class="text-xs text-yellow-400 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Payment pending
                        </span>
                      }
                      @if (booking.movie.id) {
                        <a
                          [routerLink]="['/movie', booking.movie.id]"
                          class="text-gray-400 hover:text-white text-sm font-medium transition-colors ml-auto"
                        >
                          View Movie →
                        </a>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          @if (filteredBookings().length > 5) {
            <div class="flex justify-center mt-8">
              <p class="text-gray-500 text-sm">Showing all {{ filteredBookings().length }} bookings</p>
            </div>
          }
        }

        <!-- Empty state -->
        @else {
          <div class="text-center py-16">
            <div class="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">No Bookings Found</h3>
            <p class="text-gray-400 mb-6">
              @if (activeFilter() === 'all') {
                You haven't made any bookings yet. Start by browsing our movies!
              } @else {
                No {{ activeFilter() }} bookings found.
              }
            </p>
            <a routerLink="/movies" class="btn-primary">Browse Movies</a>
          </div>
        }

        <!-- ─── Ticket Modal ─── -->
        @if (showTicketModal()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="closeTicketModal()"></div>

            <div class="relative bg-dark-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
              <!-- Header -->
              <div class="bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-center">
                <h3 class="text-2xl font-bold text-white mb-1">Movie Ticket</h3>
                <p class="text-white/80">{{ selectedBooking()?.movie?.title }}</p>
              </div>

              <!-- QR placeholder -->
              <div class="p-6 text-center border-b border-dashed border-dark-700">
                <div class="w-40 h-40 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-32 h-32" viewBox="0 0 100 100">
                    <rect fill="#fff" width="100" height="100"/>
                    <g fill="#000">
                      @for (i of qrPattern; track $index) {
                        <rect [attr.x]="i.x" [attr.y]="i.y" width="4" height="4"/>
                      }
                    </g>
                  </svg>
                </div>
                <p class="text-gray-400 text-sm">Scan at the theater entrance</p>
              </div>

              <!-- Details -->
              <div class="p-6 space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-400">Booking Ref</span>
                  <span class="text-white font-mono text-sm">{{ selectedBooking()?.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Date</span>
                  <span class="text-white">{{ formatDate(selectedBooking()?.showtime?.date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Time</span>
                  <span class="text-white">{{ selectedBooking()?.showtime?.time }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Theater</span>
                  <span class="text-white">{{ selectedBooking()?.showtime?.theater }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Seats</span>
                  <span class="text-white text-sm">{{ getSeatNumbers(selectedBooking()!) }}</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-dark-700">
                  <span class="text-gray-400">Total Paid</span>
                  <span class="text-xl font-bold text-primary-500">₹{{ selectedBooking()?.grandTotal }}</span>
                </div>
              </div>

              <div class="p-4 bg-dark-800">
                <button (click)="closeTicketModal()" class="w-full btn-secondary">Close</button>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private toastService = inject(ToastService);

  activeFilter = signal<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  showTicketModal = signal(false);
  selectedBooking = signal<BookingDetails | null>(null);
  loading = signal(false);

  readonly filterTabs = [
    { value: 'all' as const,       label: 'All Bookings' },
    { value: 'confirmed' as const,  label: 'Confirmed' },
    { value: 'pending' as const,    label: 'Pending' },
    { value: 'cancelled' as const,  label: 'Cancelled' },
  ];

  // Reactive: auto-updates whenever bookings list OR active filter changes
  readonly filteredBookings = computed(() => {
    const all = this.bookingService.bookingHistory();
    const filter = this.activeFilter();
    return filter === 'all' ? all : all.filter(b => b.status === filter);
  });

  qrPattern = this.generateQRPattern();

  ngOnInit(): void {
    this.loading.set(true);
    this.bookingService.getMyBookings()
      .catch(() => {
        this.toastService.error('Failed to load bookings', 'Please refresh the page and try again.');
      })
      .finally(() => this.loading.set(false));
  }

  setFilter(filter: 'all' | 'confirmed' | 'pending' | 'cancelled'): void {
    this.activeFilter.set(filter);
  }

  getCount(status: 'confirmed' | 'pending' | 'cancelled'): number {
    return this.bookingService.bookingHistory().filter(b => b.status === status).length;
  }

  ticketCount(booking: BookingDetails): number {
    return booking.seats?.length || booking.numberOfSeats || 0;
  }

  getSeatNumbers(booking: BookingDetails | null): string {
    if (!booking?.seats?.length) return booking?.numberOfSeats ? `${booking.numberOfSeats} seat(s)` : '—';
    return booking.seats.map(s => s.id).sort().join(', ');
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    // Append T00:00:00 so the Date constructor treats it as local time, not UTC
    const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onPosterError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  viewTicket(booking: BookingDetails): void {
    this.selectedBooking.set(booking);
    this.showTicketModal.set(true);
  }

  closeTicketModal(): void {
    this.showTicketModal.set(false);
    this.selectedBooking.set(null);
  }

  downloadTicket(booking: BookingDetails): void {
    alert(`Downloading ticket for booking ${booking.id}...`);
  }

  private generateQRPattern(): { x: number; y: number }[] {
    const pattern: { x: number; y: number }[] = [];
    const seed = [
      [1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,1,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1],
      [0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0],
      [1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,0,1],
      [0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,1,0],
      [1,1,0,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,1],
      [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,1,0],
      [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,1,0,1,0,0,1],
      [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,1,0],
      [1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,0,0,1,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,0,1,0,0,1,1,0,1,1,0],
      [1,0,1,1,1,0,1,0,1,0,0,1,0,1,1,0,0,1,0,0,1],
      [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,1,1,0,1,1,0],
      [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,0,1,0,0,1],
    ];
    for (let y = 0; y < seed.length; y++) {
      for (let x = 0; x < seed[y].length; x++) {
        if (seed[y][x] === 1) pattern.push({ x: x * 4 + 8, y: y * 4 + 8 });
      }
    }
    return pattern;
  }
}
