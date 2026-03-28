# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CineQ is a movie ticket booking web app built with **Angular 21** (standalone components, signals) and **Tailwind CSS 3**. Currently uses mock data with `TODO` comments marking where real API calls will replace them.

## Commands

```bash
npm start                    # Dev server (ng serve)
npm run build                # Production build (runs generate-env.js first)
npm test                     # Run Vitest unit tests
npx ng generate component features/<name>  # Generate a lazy-loaded feature component
```

Production builds require `node scripts/generate-env.js` to run first (generates `src/environments/environment.prod.ts` from env vars).

## Architecture

```
src/app/
├── core/            # Singleton services, guards, interceptors, models, mock data
├── shared/          # Reusable components (navbar, footer, modals, toast, movie-card)
└── features/        # Lazy-loaded route components
```

All feature routes are lazy-loaded via `loadComponent`. Protected routes use `authGuard`. The HTTP layer has `authInterceptor` registered globally via `provideHttpClient(withInterceptors([authInterceptor]))` in `app.config.ts`.

## Coding Conventions

**Components**: All standalone (`standalone: true`). Use `inject()` instead of constructor injection. Templates can be inline (`template`) or external (`templateUrl`).

**State**: Angular Signals only — no NgRx, no BehaviorSubject. Services expose `readonly` signals:
```typescript
private dataSignal = signal<Data[]>([]);
readonly data = this.dataSignal.asReadonly();
readonly filtered = computed(() => this.dataSignal().filter(...));
```

**Templates**: Use Angular 17+ block syntax (`@if`, `@for`, `@switch`). Always include `track item.id` in `@for`.

**Styling**: Tailwind utility classes only. Custom classes in `src/styles.scss`:
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Layout: `.card`, `.card-hover`, `.glass`
- Typography: `.gradient-text`, `.badge`, `.badge-primary`, `.badge-accent`
- Forms: `.input-field`

Color palette: `primary-*` (red/cinema), `accent-*` (orange), `dark-*` (dark backgrounds).

## Key Service Patterns

**Modal management** is centralized in `AuthService`:
```typescript
authService.openLoginModal() / openSignupModal() / closeAllModals()
authService.switchToSignup() / switchToLogin()
authService.isAuthenticated()  // signal-based check
```

**Toast notifications** via `ToastService`:
```typescript
toastService.success('Title', 'Message')
toastService.error(...) / .warning(...) / .info(...)
```

**Auth check pattern** before protected actions:
```typescript
if (!authService.isAuthenticated()) {
  authService.openLoginModal();
  return;
}
```

## API Integration (Not Yet Implemented)

Services currently use `src/core/data/mock-movies.ts`. When the backend is ready:
1. Inject `HttpClient` into services
2. Use `environment.apiUrl` for base URLs
3. Replace `signal.set(MOCK_DATA)` with HTTP calls
4. Add JWT handling in `auth.interceptor.ts`

## Models (src/core/models/)

- `Movie`: id, title, tagline, synopsis, posterUrl, backdropUrl, genres, rating, duration, releaseDate, `status: 'now-showing' | 'coming-soon'`, cast, director, trailer, showtimes, language
- `User`: id, fullName, email, phone, avatarUrl, createdAt
- `BookingDetails`: id, movie, showtime `{date, time, theater}`, seats, totalAmount, convenienceFee, taxes, grandTotal, `status: 'pending' | 'confirmed' | 'cancelled'`, createdAt
- `Seat`: seatNumber, row, `status: 'available' | 'selected' | 'booked'`

Barrel exports at `core/models/index.ts` and `shared/components/index.ts`.
