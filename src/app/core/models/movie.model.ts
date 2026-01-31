export interface Cast {
  id: string;
  name: string;
  character: string;
  imageUrl: string;
}

export interface Showtime {
  id: string;
  time: string;
  date: Date;
  theater: string;
  price: number;
  available: boolean;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  genres: string[];
  rating: number;
  duration: number; // in minutes
  releaseDate: Date;
  status: 'now-showing' | 'coming-soon';
  cast: Cast[];
  director: string;
  trailer: string; // YouTube URL
  showtimes: Showtime[];
  language: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  facilities: string[];
}
