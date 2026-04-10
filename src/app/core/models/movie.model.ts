// Genre interface from API
export interface Genre {
  id: string;
  name: string;
}

// Artist Type interface
export interface ArtistType {
  id: string;
  name: string; // Actor, Actress, Director, etc.
  icon?: string; // Icon class
  description?: string;
}

// Artist interface (detailed)
export interface Artist {
  id: string;
  fullName: string;
  avatar?: string; // Image URL
  rating?: number;
  bio?: string;
}

// Cast/Starcast interface from API (now with nested objects)
export interface StarCast {
  characterName: string;
  artistId: string;
  artist: Artist; // Always required from API
  artistTypeId: string;
  artistType?: ArtistType | null;
}

// Showtime interface
export interface Showtime {
  id: string;
  time: string;
  date: Date;
  theater: string;
  price: number;
  available: boolean;
}

// Movie interface - matches API response structure
export interface Movie {
  id: string;
  title: string;
  poster: string; // API field name
  banner?: string; // API field name
  duration: number; // in minutes
  releaseDate: string; // ISO format YYYY-MM-DD
  status: string; // API returns COMING_SOON, NOW_SHOWING, etc.
  genres: Genre[]; // Array of genre objects, not strings
  // Optional fields from detail API
  description?: string; // Plot synopsis
  trailerUrl?: string; // YouTube or video URL (empty if not available)
  language?: string[]; // Array of language codes like ENG, HIN
  country?: string;
  certification?: string; // U, UA, A, R
  formats?: string[]; // 2D, 3D, IMAX, 4DX
  starcast?: StarCast[]; // Array of cast members
  isActive?: boolean;
}

// Response wrapper for list API
export interface MovieListResponse {
  success: boolean;
  message: string;
  data: Movie[];
  // Pagination fields at root level (actual API structure)
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Response wrapper for detail API
export interface MovieDetailResponse {
  success: boolean;
  message: string;
  data: Movie;
  timestamp: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  facilities: string[];
}
