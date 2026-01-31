import { Movie } from '../models/movie.model';

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Aa Bata Aama',
    tagline: 'A Heartfelt Journey of Love and Sacrifice',
    synopsis: 'Aa Bata Aama is an emotional family drama that explores the deep, heartfelt bond between a mother and her child. Set against the backdrop of rural and urban Nepal, it follows the struggles of a young man trying to fulfill his mother\'s dreams while navigating modern challenges.',
    posterUrl: 'https://d346azgjfhsciq.cloudfront.net/S3/uploads/gallery/1765801697075-500_715.jpg', // Placeholder logic based on source
    backdropUrl: 'https://www.qfxcinemas.com/images/movies/AaBataAama_Backdrop.jpg',
    genres: ['Drama', 'Family'],
    rating: 8.2,
    duration: 160,
    releaseDate: new Date('2026-01-23'),
    status: 'now-showing',
    director: 'Sudeep Bhupal Singh',
    language: 'Nepali',
    cast: [
      { id: 'c1', name: 'Laxmi Giri', character: 'Aama', imageUrl: 'https://image.tmdb.org/t/p/w200/laxmi-giri.jpg' },
      { id: 'c2', name: 'Ashirwad B Chhetri', character: 'Son', imageUrl: 'https://image.tmdb.org/t/p/w200/ashirwad.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/example_nepali_1',
    showtimes: [
      { id: 's1', time: '11:30 AM', date: new Date(), theater: 'QFX Civil Mall', price: 450, available: true },
      { id: 's2', time: '05:15 PM', date: new Date(), theater: 'QFX Labim Mall', price: 500, available: true }
    ]
  },
  {
    id: '2',
    title: 'Border 2',
    tagline: 'The War Returns',
    synopsis: 'A high-octane sequel to the classic war epic, focusing on the bravery of soldiers during historic border conflicts. The film captures the intensity of the 1971 Indo-Pak war through the eyes of a new generation of fighters.',
    posterUrl: 'https://d346azgjfhsciq.cloudfront.net/S3/uploads/gallery/1766750642712-border_2.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/border2_bg.jpg',
    genres: ['Action', 'History', 'War'],
    rating: 7.9,
    duration: 200,
    releaseDate: new Date('2026-01-23'),
    status: 'now-showing',
    director: 'Anurag Singh',
    language: 'Hindi',
    cast: [
      { id: 'c3', name: 'Sunny Deol', character: 'Major Kuldip Singh', imageUrl: 'https://image.tmdb.org/t/p/w200/sunny.jpg' },
      { id: 'c4', name: 'Diljit Dosanjh', character: 'Lieutenant', imageUrl: 'https://image.tmdb.org/t/p/w200/diljit.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/example_hindi_1',
    showtimes: [
      { id: 's3', time: '02:45 PM', date: new Date(), theater: 'FCube Cube 2', price: 350, available: true },
      { id: 's4', time: '08:00 PM', date: new Date(), theater: 'FCube Cube 3', price: 400, available: true }
    ]
  },
  {
    id: '3',
    title: 'Gobar Ganesh',
    tagline: 'A Journey from Struggle to Dreams',
    synopsis: 'A neglected son raised in a cowshed moves to the city with a dream to provide his mother a better life. Facing betrayal and loneliness, his mother’s love and girlfriend’s support give him the strength to change his destiny.',
    posterUrl: 'https://d346azgjfhsciq.cloudfront.net/S3/uploads/gallery/1767351058086-gobarganeshposter.jpg',
    backdropUrl: 'https://www.fcubecinemas.com/images/movies/GobarGanesh_Backdrop.jpg',
    genres: ['Drama', 'Social'],
    rating: 7.5,
    duration: 140,
    releaseDate: new Date('2026-01-15'),
    status: 'now-showing',
    director: 'Marichman Shrestha',
    language: 'Nepali',
    cast: [
      { id: 'c5', name: 'Marichman Shrestha', character: 'Ganesh', imageUrl: 'https://image.tmdb.org/t/p/w200/marichman.jpg' },
      { id: 'c6', name: 'Buddhi Tamang', character: 'Village Friend', imageUrl: 'https://image.tmdb.org/t/p/w200/buddhi.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/example_nepali_2',
    showtimes: [
      { id: 's5', time: '01:30 PM', date: new Date(), theater: 'FCube Cube 1', price: 300, available: true }
    ]
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
    trailer: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    showtimes: [
      { id: 's11', time: '10:30 AM', date: new Date(), theater: 'Screen 1', price: 300, available: true },
      { id: 's12', time: '02:00 PM', date: new Date(), theater: 'Screen 3', price: 320, available: true },
      { id: 's13', time: '06:00 PM', date: new Date(), theater: 'Screen 1', price: 350, available: true }
    ]
  },
  {
    id: '6',
    title: 'Kung Fu Panda 4',
    tagline: 'Get ready for awesomeness',
    synopsis: 'Po must train a new warrior when he\'s chosen to become the Spiritual Leader of the Valley of Peace, and discovers his biggest fan is also his biggest threat.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg',
    genres: ['Animation', 'Comedy', 'Family'],
    rating: 7.0,
    duration: 94,
    releaseDate: new Date('2024-03-08'),
    status: 'now-showing',
    director: 'Mike Mitchell',
    language: 'English',
    cast: [
      { id: 'c17', name: 'Jack Black', character: 'Po (voice)', imageUrl: 'https://image.tmdb.org/t/p/w200/rtCx0fiYxJVhzXXdwZE2XRTfIKE.jpg' },
      { id: 'c18', name: 'Awkwafina', character: 'Zhen (voice)', imageUrl: 'https://image.tmdb.org/t/p/w200/l5AKkg3H1QhMuXmTTmq1EyjyiRb.jpg' },
      { id: 'c19', name: 'Viola Davis', character: 'The Chameleon (voice)', imageUrl: 'https://image.tmdb.org/t/p/w200/xDssAI6FPLaOQlPMIR3FvK6Mcgq.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/ZMafeDs8Txc',
    showtimes: [
      { id: 's17', time: '09:30 AM', date: new Date(), theater: 'Screen 3', price: 280, available: true },
      { id: 's18', time: '12:30 PM', date: new Date(), theater: 'Screen 1', price: 300, available: true },
      { id: 's19', time: '04:30 PM', date: new Date(), theater: 'Screen 3', price: 320, available: true }
    ]
  },
  // Coming Soon Movies
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
  id: '13',
  title: 'Sikandar',
  tagline: 'The King of Hearts returns',
  synopsis: 'Sanjay "Sikandar" Rajkot, a benevolent royal, is motivated by a tragic accident to redeem his past by changing the lives of three people. However, his mission to protect the recipients of his late wife’s organ donations puts him directly in the crosshairs of a vengeful and powerful politician.',
  posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTFkYWM2YmQtMjExNC00ZDZiLTk4M2UtNDJlMzJmNWE4M2FiXkEyXkFqcGc@._V1_QL75_UX262.5_.jpg',
  backdropUrl: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2024/04/Sikandar-Banner.jpg',
  genres: ['Action', 'Drama', 'Thriller'],
  rating: 0,
  duration: 150,
  releaseDate: new Date('2026-03-30'),
  status: 'coming-soon',
  director: 'A.R. Murugadoss',
  language: 'Hindi',
  cast: [
    { id: 'c33', name: 'Salman Khan', character: 'Sanjay Rajkot / Sikandar', imageUrl: 'https://image.tmdb.org/t/p/w200/8666U2v4S0S9Gf1iT08mIbzXfT.jpg' },
    { id: 'c34', name: 'Rashmika Mandanna', character: 'Saisri Rajkot', imageUrl: 'https://image.tmdb.org/t/p/w200/6vS9L0995zG2O5Gk1XvK36O6R2U.jpg' },
    { id: 'c35', name: 'Sathyaraj', character: 'Minister Rakesh Pradhan', imageUrl: 'https://image.tmdb.org/t/p/w200/9WYG0WfPUpfXUvjTz7x9n7S1H2.jpg' },
    { id: 'c36', name: 'Kajal Aggarwal', character: 'Vaidehi Rangachari', imageUrl: 'https://image.tmdb.org/t/p/w200/3oXvN7GfL9Z3X7p4H2m9u4Gk1X.jpg' }
  ],
  trailer: 'https://www.youtube.com/embed/Sikandar_Official_Trailer',
  showtimes: [
    { id: 's20', time: '10:30 AM', date: new Date(), theater: 'QFX Civil Mall', price: 450, available: true },
    { id: 's21', time: '02:00 PM', date: new Date(), theater: 'FCube Cube 1', price: 350, available: true },
    { id: 's22', time: '06:30 PM', date: new Date(), theater: 'One Cinemas', price: 500, available: true }
  ]
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
    movieId: '1',
    title: 'Aa Bata Aama',
    tagline: 'Now playing in theaters across Nepal',
    imageUrl: 'https://d346azgjfhsciq.cloudfront.net/S3/uploads/gallery/1769586858894-banner.jpg',
    ctaText: 'Book Tickets'
  },
   {

    id: 3,

    movieId: '4',

    title: 'Spider-Man: Across the Spider-Verse',

    tagline: 'A visual masterpiece',

    imageUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',

    ctaText: 'Book Now'

  }
];
