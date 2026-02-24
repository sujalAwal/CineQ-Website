import { Movie } from '../models/movie.model';

export const MOCK_MOVIES: Movie[] = [
  {
    id: '4',
    title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It\'s how you wear the mask that matters',
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    genres: ['Animation', 'Action', 'Adventure'],
    rating: 8.7,
    duration: 140,
    releaseDate: new Date('2023-06-02'),
    status: 'now-showing',
    director: 'Joaquim Dos Santos',
    language: 'English',
    cast: [
      { id: 'c11', name: 'Shameik Moore', character: 'Miles Morales (voice)', imageUrl: 'https://image.tmdb.org/t/p/w200/uJNaSTsfBOvtFWsPP1FSsFq33oB.jpg' },
      { id: 'c12', name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)', imageUrl: 'https://image.tmdb.org/t/p/w200/dxSDWkiVaC6JYjrV3XRAZI7HOSS.jpg' },
      { id: 'c13', name: 'Oscar Isaac', character: 'Miguel O\'Hara (voice)', imageUrl: 'https://image.tmdb.org/t/p/w200/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg' }
    ],
    trailer: 'https://youtu.be/shW9i6k8cB0',
    showtimes: [
      { id: 's11', time: '10:30 AM', date: new Date(), theater: 'Screen 1', price: 300, available: true },
      { id: 's12', time: '02:00 PM', date: new Date(), theater: 'Screen 3', price: 320, available: true },
      { id: 's13', time: '06:00 PM', date: new Date(), theater: 'Screen 1', price: 350, available: true }
    ]
  },
  {
  id: 'jackie-brown01',
  title: 'Jackie Brown',
  tagline: 'The Queen of Crime returns.',
  synopsis: 'Jackie Brown, a flight attendant caught in a web of crime and deception, navigates a dangerous game between law enforcement and ruthless criminals. In a thrilling turn of events, Jackie takes matters into her own hands as she tries to outwit both sides. Directed by Quentin Tarantino, the film is a gritty, stylish crime thriller with stellar performances from Pam Grier and Samuel L. Jackson.',
  posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/jackie-brown-et00486304-1770715655.jpg',
  backdropUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/jackie-brown-banner.jpg',
  genres: ['Crime', 'Thriller', 'Drama'],
  rating: 8.0, // Movie rating
  duration: 154, // Approx runtime from sources
  releaseDate: new Date('1997-12-25'), // Original release date
  status: 'now-showing',
  director: 'Quentin Tarantino',
  language: 'English',
  cast: [
    { id: 'cast01', name: 'Pam Grier', character: 'Jackie Brown', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/pam-grier-2055040-1770707331.jpg' },
    { id: 'cast02', name: 'Samuel L. Jackson', character: 'Ordell Robbie', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/samuel-l-jackson-2018-1770707497.jpg' },
    { id: 'cast03', name: 'Robert Forster', character: 'Max Cherry', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/robert-forster-2019-1770707708.jpg' },
    { id: 'cast04', name: 'Bridget Fonda', character: 'Melanie', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/bridget-fonda-2556-1770707418.jpg' },
    { id: 'cast05', name: 'Michael Keaton', character: 'Ray Nicolette', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/michael-keaton-2857-1770707357.jpg' }
  ],
  trailer: 'https://www.youtube.com/embed/QZxIRp8ddhI',
  showtimes: [] // Will populate once bookings open
}
,
  {
  id: 'toxic01',
  title: 'Toxic: A Fairy Tale for Grown‑ups',
  tagline: 'A dark fable of power, revenge and survival.',
  synopsis: 'Toxic: A Fairy Tale for Grown‑ups is a high‑budget pan‑India gangster action thriller directed by Geetu Mohandas. The film follows the ruthless rise of Raya in the underworld amid political corruption and violent rivalry, blending mythic storytelling with gritty action. It stars Yash in the lead, supported by a stellar ensemble cast. Released in six languages including Kannada and Hindi, Toxic is set to be one of 2026’s biggest cinematic events.',
  posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/toxic-a-fairy-tale-for-grown-ups-et00378770-1767955073.jpg', 
  backdropUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/toxic-banner.jpg',
  genres: ['Action', 'Crime', 'Thriller'],
  rating: 0, // Official rating not yet published
  duration: 122, // Approx runtime from industry listings
  releaseDate: new Date('2026-03-19'),
  status: 'coming-soon',
  director: 'Geetu Mohandas',
  language: 'Kannada, Hindi & multiple dubbed versions',
  cast: [
    { id: 'cast01', name: 'Yash', character: 'Raya', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/yash-2537-1649749519.jpg' },
    { id: 'cast02', name: 'Kiara Advani', character: 'Nadia', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/kiara-advani-1043272-1655467015.jpg' },
    { id: 'cast03', name: 'Nayanthara', character: 'Ganga', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/nayanthara-5143-1675058766.jpg' },
    { id: 'cast04', name: 'Huma Qureshi', character: 'Elizabeth', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/huma-qureshi-30360-1769582788.jpg' },
    { id: 'cast05', name: 'Tara Sutaria', character: 'Rebecca', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tara-sutaria-30191-11-04-2018-11-57-15.jpg' },
    { id: 'cast06', name: 'Rukmini Vasanth', character: 'Mellisa', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/rukmini-vasanth-1092753-15-05-2018-10-49-55.jpg' }],
  trailer: 'https://www.youtube.com/',
  showtimes: [] // Will populate once bookings open
},
  {
    id: '7',
    title: 'Deadpool & Wolverine',
    tagline: 'Come together',
    synopsis: 'Deadpool joins the Marvel Cinematic Universe and teams up with Wolverine for an adventure that will change everything.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    genres: ['Action', 'Comedy', 'Superhero'],
    rating: 0,
    duration: 127,
    releaseDate: new Date('2024-07-26'),
    status: 'coming-soon',
    director: 'Shawn Levy',
    language: 'English',
    cast: [
      { id: 'c20', name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool', imageUrl: 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg' },
      { id: 'c21', name: 'Hugh Jackman', character: 'Logan / Wolverine', imageUrl: 'https://image.tmdb.org/t/p/w200/oNeS4zChE7HAS7LeM3Xu6StCv6a.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/73_1biulkYk',
    showtimes: []
  },
  {
  id: 'dr1',
  title: 'Dhurandhar: The Revenge',
  tagline: 'The storm returns with vengeance.',
  synopsis: 'Dhurandhar: The Revenge is an upcoming Hindi‑language spy action thriller and the sequel to the blockbuster film Dhurandhar. Undercover agent Hamza Ali Mazari continues his mission, infiltrating criminal syndicates and confronting powerful adversaries while seeking retribution and justice. The film expands its narrative stakes and emotional depth with an ensemble cast. ',
  posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dhurandhar-the-revenge-et00478890-1770096576.jpg', // official image from BookMyShow
  backdropUrl: 'https://in.bookmyshow.com/movies/dhurandhar-the-revenge/ET00478890/banner', // official hero/banner image
  genres: ['Action', 'Thriller', 'Spy'],
  rating: 0, // Not rated yet
  duration: 208, // Approx runtime from sources (may update) :contentReference[oaicite:1]{index=1}
  releaseDate: new Date('2026-03-19'),
  status: 'coming-soon',
  director: 'Aditya Dhar',
  language: 'Hindi',
  cast: [
    { id: 'cast1', name: 'Ranveer Singh', character: 'Hamza Ali Mazari / Jaskirat Singh Rangi', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/ranveer_singh_19858_26-07-2016_04-59-37.jpg' },
    { id: 'cast2', name: 'Sanjay Dutt', character: 'SP Chaudhary Aslam', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/sanjay-dutt-2035-12-09-2017-05-07-10.jpg' },
    { id: 'cast3', name: 'R. Madhavan', character: 'Ajay Sanyal', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/r-madhavan-6790-1657260233.jpg' },
    { id: 'cast4', name: 'Arjun Rampal', character: 'Major Iqbal', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/arjun-rampal-225-24-03-2017-12-44-48.jpg' },
    { id: 'cast5', name: 'Sara Arjun', character: 'Yalina Jamali', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/sara-arjun-1055790-1764496804.jpg' }
  ],
  trailer: 'https://www.youtube.com/embed/6ms_PBlLx74', // Official teaser/trailer announcement :contentReference[oaicite:2]{index=2}
  showtimes: [] // Coming soon once theatres open booking
},
   {
    id: '4',
    title: 'Rammita Koo Pirati',
    tagline: 'Love after Heartbreak',
    synopsis: 'Rammita emerges from a toxic five-year relationship, believing her world has ended. As she navigates her heartbreak, she discovers new layers of herself and the possibility of a love that is kind and healing.',
    posterUrl: 'https://www.fcubecinemas.com/GetThumbnailImage/1713',
    backdropUrl: 'https://www.qfxcinemas.com/images/movies/Rammita_Backdrop.jpg',
    genres: ['Romance', 'Drama'],
    rating: 0,
    duration: 145,
    releaseDate: new Date('2026-02-06'),
    status: 'coming-soon',
    director: 'Sudepta',
    language: 'Nepali',
    cast: [
      { id: 'c7', name: 'Anna Sharma', character: 'Rammita', imageUrl: 'https://image.tmdb.org/t/p/w200/anna.jpg' },
      { id: 'c8', name: 'Dhiraj Magar', character: 'Sahaj', imageUrl: 'https://image.tmdb.org/t/p/w200/dhiraj.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/example_nepali_3',
    showtimes: []
  },
  {
  id: 'spirit01',
  title: 'Spirit',
  tagline: 'An untold story of passion and revolution.',
  synopsis: 'Spirit is an upcoming Indian action drama that blends thrilling fight sequences with emotional storytelling. Set in a turbulent political backdrop, it explores a man’s quest for justice and his struggle to break free from the chains of tradition. The film stars Prabhas in a high-octane role, along with Tripti Dimri. Directed by the acclaimed Sandeep Reddy Vanga, it promises to be a cinematic spectacle.',
  posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/spirit-et00452121-1767338835.jpg',
  backdropUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/spirit-banner.jpg',
  genres: ['Action', 'Drama', 'Thriller'],
  rating: 0, // Official rating not yet published
  duration: 150, // Approx runtime from industry listings
  releaseDate: new Date('2026-05-15'),
  status: 'coming-soon',
  director: 'Sandeep Reddy Vanga',
  language: 'Hindi, Telugu, Kannada (multi‑language)',
  cast: [
    { id: 'cast01', name: 'Prabhas', character: 'Raghav', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/prabhas-1708-1686915417.jpg' },
    { id: 'cast02', name: 'Tripti Dimri', character: 'Suman', imageUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tripti-dimri-1093177-01-06-2018-03-16-40.jpg' }
  ],
  trailer: 'https://www.youtube.com/embed/5tq1Wcz5f8s',
  showtimes: [] // Will populate once bookings open
},
  {
    id: '11',
    title: 'Avatar 3',
    tagline: 'Return to Pandora',
    synopsis: 'Jake Sully and Ney\'tiri return for another epic adventure on Pandora, exploring new regions and facing new challenges.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    genres: ['Sci-Fi', 'Adventure', 'Fantasy'],
    rating: 0,
    duration: 180,
    releaseDate: new Date('2025-12-19'),
    status: 'coming-soon',
    director: 'James Cameron',
    language: 'English',
    cast: [
      { id: 'c29', name: 'Sam Worthington', character: 'Jake Sully', imageUrl: 'https://image.tmdb.org/t/p/w200/blKKsHlJIL9PxvUkJhHpIk5L0bg.jpg' },
      { id: 'c30', name: 'Zoe Saldaña', character: 'Neytiri', imageUrl: 'https://image.tmdb.org/t/p/w200/iOVbUH20il632nj2v01NCtYYeSg.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/a8Gx8wiNbs8',
    showtimes: []
  }
];

export const HERO_BANNERS = [
  {
    id: 1,
    movieId: '4',
    title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'A visual masterpiece',
    imageUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    ctaText: 'Book Now'
  },
  {
    id: 2,
    movieId: 'toxic01',
    title: 'Toxic: A Fairy Tale for Grown‑ups',
    tagline: 'A dark fable of power, revenge and survival.',
    imageUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/toxic-a-fairy-tale-for-grown-ups-et00378770-1767955073.jpg',
    trailerUrl: 'https://www.youtube.com/',
    ctaText: 'Book Now'
  },
  {
    id: 2,
    movieId: '7',
    title: 'Dhurandhar: The Revenge',
    tagline: 'The storm returns with vengeance.',
    imageUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/dhurandhar-the-revenge-et00478890-1770096576.jpg',
    trailerUrl: 'https://www.youtube.com/embed/6ms_PBlLx74',
    ctaText: 'Book Now'
  }
];
