import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { BannerService } from '../../core/services/banner.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  movieService = inject(MovieService);
  bannerService = inject(BannerService);
  
  currentSlide = signal(0);
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.bannerService.loadBanners();
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
    const banners = this.bannerService.banners();
    if (!banners.length) return;
    this.currentSlide.update(current => (current + 1) % banners.length);
  }

  prevSlide(): void {
    const banners = this.bannerService.banners();
    if (!banners.length) return;
    this.currentSlide.update(current => (current - 1 + banners.length) % banners.length);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
