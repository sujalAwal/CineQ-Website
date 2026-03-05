import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Banner, BannerApiResponse } from '../models/banner.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private http = inject(HttpClient);

  private bannersSignal = signal<Banner[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly banners = this.bannersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * Fetch banners from API and populate the signal.
   * GET /api/public/banners
   */
  loadBanners(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<BannerApiResponse>(`${environment.apiUrl}/public/banners`).subscribe({
      next: (response) => {
        if (response.success) {
          const sorted = [...response.data].sort((a, b) => a.order - b.order);
          this.bannersSignal.set(sorted);
        } else {
          this.errorSignal.set(response.message ?? 'Failed to load banners.');
        }
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('BannerService: Failed to load banners', err);
        this.errorSignal.set('Unable to load banners. Please try again later.');
        this.loadingSignal.set(false);
      }
    });
  }
}
