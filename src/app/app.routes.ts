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
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'My Profile - CineQ'
  },
  {
    path: 'bookings',
    loadComponent: () => import('./features/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [authGuard],
    title: 'My Bookings - CineQ'
  },
  {
    path: 'customer-portal',
    loadComponent: () => import('./features/customer-portal/customer-portal.component').then(m => m.CustomerPortalComponent),
    title: 'Customer Portal - CineQ'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
