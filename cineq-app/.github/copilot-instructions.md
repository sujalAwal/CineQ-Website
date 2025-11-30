# CineQ - AI Development Instructions

## Project Overview

CineQ is a modern movie ticket booking web application built with Angular 21 and Tailwind CSS. The application provides a cinema-themed dark UI for browsing movies, viewing details, and booking tickets.

## Tech Stack

- **Framework**: Angular 21 (standalone components, signals)
- **Styling**: Tailwind CSS 3 with custom theme
- **State Management**: Angular Signals
- **Forms**: Angular Reactive Forms
- **Routing**: Angular Router with lazy loading
- **Language**: TypeScript 5.9+

## Project Structure

```
src/app/
├── core/                    # Core functionality
│   ├── guards/              # Route guards (auth.guard.ts)
│   ├── models/              # TypeScript interfaces
│   │   ├── movie.model.ts   # Movie, Cast, Showtime interfaces
│   │   ├── user.model.ts    # User, LoginCredentials, SignupData
│   │   └── booking.model.ts # Seat, BookingDetails, PaymentMethod
│   ├── services/            # Singleton services
│   │   ├── auth.service.ts  # Authentication & modal state
│   │   ├── movie.service.ts # Movie data operations
│   │   ├── booking.service.ts # Booking & seat management
│   │   └── toast.service.ts # Notification system
│   └── data/                # Static mock data
│       └── mock-movies.ts   # Movie dataset
├── shared/                  # Reusable components
│   └── components/
│       ├── navbar/          # Navigation bar
│       ├── footer/          # Site footer
│       ├── movie-card/      # Movie card component
│       ├── login-modal/     # Login modal
│       ├── signup-modal/    # Signup modal
│       └── toast/           # Toast notifications
├── features/                # Feature modules (lazy-loaded)
│   ├── home/                # Landing page
│   ├── movies/              # Now showing listing
│   ├── coming-soon/         # Upcoming movies
│   ├── movie-detail/        # Movie details page
│   └── booking/             # Booking flow
└── environments/            # Environment configs
```

## Coding Conventions

### Component Structure

1. **Use standalone components** - All components should have `standalone: true`
2. **Inline templates preferred** - Use `template` instead of `templateUrl` for most components
3. **Signal-based state** - Use Angular Signals for reactive state management
4. **Inject function** - Use `inject()` instead of constructor injection

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: []
})
export class ExampleComponent {
  private service = inject(ExampleService);
  mySignal = signal<string>('');
  computedValue = computed(() => this.mySignal().toUpperCase());
}
```

### Naming Conventions

- **Files**: kebab-case (`movie-card.component.ts`)
- **Classes**: PascalCase (`MovieCardComponent`)
- **Interfaces**: PascalCase (`Movie`, `User`)
- **Services**: PascalCase with Service suffix (`MovieService`)
- **Signals**: camelCase (`currentUser`, `isLoading`)
- **CSS classes**: Tailwind utility classes

### Template Syntax

Use Angular 17+ control flow syntax:

```html
@if (condition) {
  <div>Content</div>
} @else {
  <div>Alternative</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <div>No items found</div>
}

@switch (status) {
  @case ('loading') { <spinner /> }
  @case ('error') { <error-message /> }
  @default { <content /> }
}
```

### Styling Guidelines

1. **Use Tailwind utility classes** for all styling
2. **Custom classes defined in** `styles.scss`:
   - `.btn-primary`, `.btn-secondary`, `.btn-ghost` - Button variants
   - `.card`, `.card-hover` - Card containers
   - `.input-field` - Form inputs
   - `.badge`, `.badge-primary`, `.badge-accent` - Badge styles
   - `.glass` - Glassmorphism effect
   - `.gradient-text` - Gradient text effect

3. **Color palette** (defined in `tailwind.config.js`):
   - `primary-*` - Red tones (cinema theme)
   - `accent-*` - Orange tones
   - `dark-*` - Dark grays/blacks for backgrounds

### Service Patterns

Services use signals for reactive state:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private dataSignal = signal<Data[]>([]);
  private loadingSignal = signal(false);

  // Public readonly signals
  readonly data = this.dataSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  // Computed values
  readonly filteredData = computed(() => 
    this.dataSignal().filter(item => item.active)
  );

  // Methods with TODO comments for API integration
  async fetchData(): Promise<void> {
    // TODO: Replace with API call
    // return this.http.get<Data[]>(`${environment.apiUrl}/data`);
    this.dataSignal.set(MOCK_DATA);
  }
}
```

### Route Configuration

Routes use lazy loading:

```typescript
{
  path: 'feature',
  loadComponent: () => import('./features/feature/feature.component')
    .then(m => m.FeatureComponent),
  canActivate: [authGuard], // If protected
  title: 'Page Title - CineQ'
}
```

## Key Models

### Movie
```typescript
interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  genres: string[];
  rating: number;
  duration: number;
  releaseDate: Date;
  status: 'now-showing' | 'coming-soon';
  cast: Cast[];
  director: string;
  trailer: string;
  showtimes: Showtime[];
  language: string;
}
```

### User
```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  createdAt: Date;
}
```

### Booking
```typescript
interface BookingDetails {
  id: string;
  movie: Movie;
  showtime: { date: Date; time: string; theater: string };
  seats: Seat[];
  totalAmount: number;
  convenienceFee: number;
  taxes: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}
```

## Common Patterns

### Modal Management
Modals are controlled via AuthService signals:
```typescript
// Open modal
authService.openLoginModal();
authService.openSignupModal();

// Close modal
authService.closeLoginModal();
authService.closeAllModals();

// Switch between modals
authService.switchToSignup();
authService.switchToLogin();
```

### Toast Notifications
```typescript
toastService.success('Title', 'Optional message');
toastService.error('Error Title', 'Error details');
toastService.warning('Warning', 'Warning message');
toastService.info('Info', 'Information message');
```

### Authentication Check
```typescript
if (!authService.isAuthenticated()) {
  authService.openLoginModal();
  return;
}
// Proceed with authenticated action
```

## API Integration Notes

When backend is ready, replace mock data calls with HTTP requests:

1. Import `HttpClient` in services
2. Use environment variables for API URLs
3. Replace signal updates with HTTP observables/promises
4. Add error handling and loading states
5. Implement proper JWT token management in interceptors

## Testing

- Unit tests use Vitest
- Test files follow pattern: `*.spec.ts`
- Focus on service logic and component behavior

## Performance Considerations

1. **Lazy loading** - All feature routes are lazy-loaded
2. **OnPush change detection** - Consider for presentational components
3. **Track by** - Always use `track` in `@for` loops
4. **Image optimization** - Use `loading="lazy"` for images
5. **Computed signals** - Use for derived state instead of methods in templates

## Accessibility

1. Use semantic HTML elements
2. Add `aria-label` for icon-only buttons
3. Ensure proper heading hierarchy
4. Support keyboard navigation
5. Maintain color contrast ratios (dark theme)

## Common Commands

```bash
npm run build      # Production build
npx ng serve       # Development server
npx ng generate component features/name  # Generate component
npx ng test        # Run tests
```
