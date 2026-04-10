import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MasterDataResponse, MasterDataStatus } from '../models/master-data.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private masterDataSignal = signal<MasterDataResponse | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly masterData = this.masterDataSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {
    this.fetchMasterData();
  }

  /**
   * Fetch master data from API (only called once)
   */
  private fetchMasterData(): void {
    if (this.masterDataSignal() !== null) {
      return; // Already fetched
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http
      .get<MasterDataResponse>(`${environment.api.baseUrl}/public/master-data`)
      .subscribe({
        next: (response) => {
          this.masterDataSignal.set(response);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          console.error('Failed to fetch master data:', err);
          this.errorSignal.set('Failed to load master data');
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Get movie release status by code
   */
  getStatusByCode(code: string): MasterDataStatus | undefined {
    return this.masterDataSignal()?.data.movieReleaseStatuses.find(
      status => status.code === code
    );
  }

  /**
   * Get human-readable status name by code
   */
  getStatusName(code: string): string {
    return this.getStatusByCode(code)?.name || code;
  }

  /**
   * Check if status is "NOW_SHOWING"
   */
  isNowShowing(statusCode: string): boolean {
    return statusCode === 'NOW_SHOWING';
  }

  /**
   * Check if status is "COMING_SOON"
   */
  isComingSoon(statusCode: string): boolean {
    return statusCode === 'COMING_SOON';
  }
}
