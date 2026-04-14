import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { SeatPreference, SuggestedSeat } from '../../../core/models/booking.model';

@Component({
  selector: 'app-smart-seat-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './smart-seat-selector.component.html',
  styleUrls: ['./smart-seat-selector.component.scss']
})
export class SmartSeatSelectorComponent {
  @Input() showtimeId!: string;
  @Output() seatsSelected = new EventEmitter<string[]>();
  @Output() closed = new EventEmitter<void>();

  private bookingService = inject(BookingService);
  private toastService = inject(ToastService);

  selectedSeats = signal<number>(2);
  selectedPreference = signal<SeatPreference>('MIDDLE');
  loading = signal(false);
  suggestedSeats = signal<SuggestedSeat[] | null>(null);

  // Computed vehicle icon for display
  displayedVehicle = computed(() => this.getVehicleIcon(this.selectedSeats()));

  // Vehicle icon mapping
  readonly vehicleIcons: Record<number, { label: string; emoji: string; description: string }> = {
    2: { label: '🏍️', emoji: '🏍️', description: 'Two Seats' },
    3: { label: '🚙', emoji: '🚙', description: 'Three Seats' },
    4: { label: '🚗', emoji: '🚗', description: 'Four Seats' },
    5: { label: '🚙', emoji: '🚙', description: 'Five Seats' },
    6: { label: '🚌', emoji: '🚌', description: 'Six Seats' }
  };

  readonly seatOptions = [2, 3, 4, 5, 6];
  readonly preferences: SeatPreference[] = ['FRONT', 'MIDDLE', 'BACK'];

  getVehicleIcon(seats: number) {
    return this.vehicleIcons[seats] || this.vehicleIcons[2];
  }

  selectSeats(count: number): void {
    this.selectedSeats.set(count);
  }

  selectPreference(preference: SeatPreference): void {
    this.selectedPreference.set(preference);
  }

  async getSuggestions(): Promise<void> {
    if (!this.showtimeId) {
      this.toastService.error('Error', 'Showtime ID is required');
      return;
    }

    this.loading.set(true);
    this.suggestedSeats.set(null);

    try {
      const response = await this.bookingService.getSmartSeatSuggestions(
        this.showtimeId,
        this.selectedSeats(),
        this.selectedPreference()
      );

      if (response.data.suggestions && response.data.suggestions.length > 0) {
        // Get the best suggestion (rank 1)
        const bestSuggestion = response.data.suggestions[0];
        this.suggestedSeats.set(bestSuggestion.seats);
      } else {
        this.toastService.warning(
          'No suggestions available',
          'Please manually select seats or try a different preference.'
        );
      }
    } catch (error: any) {
      console.error('Error getting seat suggestions:', error);
      this.toastService.error(
        'Error',
        error?.message || 'Failed to get seat suggestions. Please try again.'
      );
    } finally {
      this.loading.set(false);
    }
  }

  confirmSelection(): void {
    const seats = this.suggestedSeats();
    if (seats && seats.length > 0) {
      const seatNames = seats.map(s => s.seatNumber);
      this.seatsSelected.emit(seatNames);
      this.close();
    } else {
      this.toastService.warning('No seats selected', 'Please get suggestions first');
    }
  }

  getTotalPrice(): number {
    const seats = this.suggestedSeats();
    if (!seats) return 0;
    return seats.reduce((sum, s) => sum + s.price, 0);
  }

  close(): void {
    this.closed.emit();
  }
}
