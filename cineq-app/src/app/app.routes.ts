import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'CineQ - Book Movie Tickets Online'
  },
  {
    path: 'movies',
    loadComponent: () => import('./features/movies/movies.component').then(m => m.MoviesComponent),
    title: 'Now Showing - CineQ'
  },
  {
    path: 'coming-soon',
    loadComponent: () => import('./features/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent),
    title: 'Coming Soon - CineQ'
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    title: 'Movie Details - CineQ'
  },
  {
    path: 'booking/:movieId',
    loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent),
    canActivate: [authGuard],
    title: 'Book Tickets - CineQ'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
