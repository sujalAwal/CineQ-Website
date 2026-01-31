import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
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
          <button 
            (click)="setFilter('all')"
            [class.bg-primary-600]="activeFilter() === 'all'"
            [class.bg-dark-800]="activeFilter() !== 'all'"
            class="px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap"
          >
            All Bookings
          </button>
          <button 
            (click)="setFilter('confirmed')"
            [class.bg-primary-600]="activeFilter() === 'confirmed'"
            [class.bg-dark-800]="activeFilter() !== 'confirmed'"
            class="px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap"
          >
            Confirmed
          </button>
          <button 
            (click)="setFilter('pending')"
            [class.bg-primary-600]="activeFilter() === 'pending'"
            [class.bg-dark-800]="activeFilter() !== 'pending'"
            class="px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap"
          >
            Pending
          </button>
          <button 
            (click)="setFilter('cancelled')"
            [class.bg-primary-600]="activeFilter() === 'cancelled'"
            [class.bg-dark-800]="activeFilter() !== 'cancelled'"
            class="px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap"
          >
            Cancelled
          </button>
        </div>

        @if (filteredBookings().length > 0) {
          <!-- Bookings List -->
          <div class="space-y-4">
            @for (booking of filteredBookings(); track booking.id) {
              <div class="card card-hover overflow-hidden">
                <div class="flex flex-col md:flex-row">
                  <!-- Movie Poster -->
                  <div class="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img 
                      [src]="booking.movie.posterUrl" 
                      [alt]="booking.movie.title"
                      class="w-full h-full object-cover"
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
                        <p class="text-gray-400 text-sm">Booking ID: {{ booking.id }}</p>
                      </div>

                      <div class="mt-4 md:mt-0 text-right">
                        <p class="text-2xl font-bold text-white">₹{{ booking.grandTotal }}</p>
                        <p class="text-gray-500 text-sm">{{ booking.seats.length }} Ticket(s)</p>
                      </div>
                    </div>

                    <!-- Show Info -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Date</p>
                        <p class="text-white font-medium">{{ booking.showtime.date | date:'MMM d, yyyy' }}</p>
                      </div>
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Time</p>
                        <p class="text-white font-medium">{{ booking.showtime.time }}</p>
                      </div>
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Theater</p>
                        <p class="text-white font-medium truncate">{{ booking.showtime.theater }}</p>
                      </div>
                      <div class="bg-dark-800 rounded-lg p-3">
                        <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Seats</p>
                        <p class="text-white font-medium truncate">{{ getSeatNumbers(booking) }}</p>
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
                        <button 
                          (click)="downloadTicket(booking)"
                          class="btn-secondary text-sm flex items-center space-x-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                          </svg>
                          <span>Download</span>
                        </button>
                      }
                      @if (booking.status === 'confirmed' || booking.status === 'pending') {
                        <button 
                          (click)="cancelBooking(booking)"
                          class="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          Cancel Booking
                        </button>
                      }
                      <a 
                        [routerLink]="['/movie', booking.movie.id]"
                        class="text-gray-400 hover:text-white text-sm font-medium transition-colors ml-auto"
                      >
                        View Movie Details →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Pagination (if needed) -->
          @if (filteredBookings().length > 5) {
            <div class="flex justify-center mt-8">
              <p class="text-gray-500">Showing all {{ filteredBookings().length }} bookings</p>
            </div>
          }
        } @else {
          <!-- Empty State -->
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
            <a routerLink="/movies" class="btn-primary">
              Browse Movies
            </a>
          </div>
        }

        <!-- Ticket Modal -->
        @if (showTicketModal()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="closeTicketModal()"></div>
            
            <!-- Modal Content -->
            <div class="relative bg-dark-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
              <!-- Ticket Header -->
              <div class="bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-center">
                <h3 class="text-2xl font-bold text-white mb-1">Movie Ticket</h3>
                <p class="text-white/80">{{ selectedBooking()?.movie?.title }}</p>
              </div>

              <!-- QR Code Section -->
              <div class="p-6 text-center border-b border-dashed border-dark-700">
                <div class="w-40 h-40 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <!-- Placeholder QR Code -->
                  <div class="text-dark-900 text-xs font-mono p-4 text-center">
                    <svg class="w-32 h-32" viewBox="0 0 100 100">
                      <rect fill="#fff" width="100" height="100"/>
                      <g fill="#000">
                        @for (i of qrPattern; track $index) {
                          <rect [attr.x]="i.x" [attr.y]="i.y" width="4" height="4"/>
                        }
                      </g>
                    </svg>
                  </div>
                </div>
                <p class="text-gray-400 text-sm">Scan this QR code at the theater</p>
              </div>

              <!-- Ticket Details -->
              <div class="p-6 space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-400">Booking ID</span>
                  <span class="text-white font-mono">{{ selectedBooking()?.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Date</span>
                  <span class="text-white">{{ selectedBooking()?.showtime?.date | date:'EEE, MMM d, yyyy' }}</span>
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
                  <span class="text-white">{{ getSeatNumbers(selectedBooking()!) }}</span>
                </div>
                <div class="flex justify-between pt-4 border-t border-dark-700">
                  <span class="text-gray-400">Total Paid</span>
                  <span class="text-xl font-bold text-primary-500">₹{{ selectedBooking()?.grandTotal }}</span>
                </div>
              </div>

              <!-- Close Button -->
              <div class="p-4 bg-dark-800">
                <button (click)="closeTicketModal()" class="w-full btn-secondary">
                  Close
                </button>
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

  activeFilter = signal<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  showTicketModal = signal(false);
  selectedBooking = signal<BookingDetails | null>(null);

  // QR Code pattern (simplified visual pattern)
  qrPattern = this.generateQRPattern();

  readonly bookings = this.bookingService.bookingHistory;

  filteredBookings = signal<BookingDetails[]>([]);

  ngOnInit(): void {
    this.updateFilteredBookings();
  }

  setFilter(filter: 'all' | 'confirmed' | 'pending' | 'cancelled'): void {
    this.activeFilter.set(filter);
    this.updateFilteredBookings();
  }

  private updateFilteredBookings(): void {
    const all = this.bookings();
    const filter = this.activeFilter();
    
    if (filter === 'all') {
      this.filteredBookings.set(all);
    } else {
      this.filteredBookings.set(all.filter(b => b.status === filter));
    }
  }

  getSeatNumbers(booking: BookingDetails): string {
    if (!booking?.seats) return '';
    return booking.seats.map(s => s.id).join(', ');
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
    // TODO: Implement actual PDF download
    alert(`Downloading ticket for booking ${booking.id}...`);
  }

  cancelBooking(booking: BookingDetails): void {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      // TODO: Implement actual cancellation with API
      alert('Booking cancellation will be implemented with the backend API.');
    }
  }

  private generateQRPattern(): { x: number; y: number }[] {
    const pattern: { x: number; y: number }[] = [];
    // Generate a simplified QR-like pattern
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
        if (seed[y][x] === 1) {
          pattern.push({ x: x * 4 + 8, y: y * 4 + 8 });
        }
      }
    }
    return pattern;
  }
}
