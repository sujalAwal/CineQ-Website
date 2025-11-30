import { Movie } from '../models/movie.model';

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 8.8,
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    status: 'now-showing',
    director: 'Denis Villeneuve',
    language: 'English',
    cast: [
      { id: 'c1', name: 'Timothée Chalamet', character: 'Paul Atreides', imageUrl: 'https://image.tmdb.org/t/p/w200/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
      { id: 'c2', name: 'Zendaya', character: 'Chani', imageUrl: 'https://image.tmdb.org/t/p/w200/tylFh7gkVxW6TdpKBzzPHu21obe.jpg' },
      { id: 'c3', name: 'Rebecca Ferguson', character: 'Lady Jessica', imageUrl: 'https://image.tmdb.org/t/p/w200/lJloTOheuQSirSLXNA3JHsrMNfH.jpg' },
      { id: 'c4', name: 'Josh Brolin', character: 'Gurney Halleck', imageUrl: 'https://image.tmdb.org/t/p/w200/sX2etBbIkxRaCsATyw5ZpOVMPTD.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/Way9Dexny3w',
    showtimes: [
      { id: 's1', time: '10:00 AM', date: new Date(), theater: 'IMAX Screen 1', price: 450, available: true },
      { id: 's2', time: '01:30 PM', date: new Date(), theater: 'Screen 2', price: 350, available: true },
      { id: 's3', time: '05:00 PM', date: new Date(), theater: 'IMAX Screen 1', price: 450, available: true },
      { id: 's4', time: '09:00 PM', date: new Date(), theater: 'Screen 3', price: 380, available: false }
    ]
  },
  {
    id: '2',
    title: 'Oppenheimer',
    tagline: 'The world forever changes',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
    genres: ['Drama', 'History', 'Thriller'],
    rating: 8.5,
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    status: 'now-showing',
    director: 'Christopher Nolan',
    language: 'English',
    cast: [
      { id: 'c5', name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', imageUrl: 'https://image.tmdb.org/t/p/w200/dm6V24NjjvjMiCtbMkc8Y2WPm2e.jpg' },
      { id: 'c6', name: 'Emily Blunt', character: 'Kitty Oppenheimer', imageUrl: 'https://image.tmdb.org/t/p/w200/nPJXaL2dMlfXfBnKYFLsxDIyHST.jpg' },
      { id: 'c7', name: 'Robert Downey Jr.', character: 'Lewis Strauss', imageUrl: 'https://image.tmdb.org/t/p/w200/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/uYPbbksJxIg',
    showtimes: [
      { id: 's5', time: '11:00 AM', date: new Date(), theater: 'Screen 1', price: 350, available: true },
      { id: 's6', time: '03:00 PM', date: new Date(), theater: 'IMAX Screen 1', price: 500, available: true },
      { id: 's7', time: '07:30 PM', date: new Date(), theater: 'Screen 2', price: 380, available: true }
    ]
  },
  {
    id: '3',
    title: 'The Batman',
    tagline: 'Unmask the truth',
    synopsis: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvber9r3KuQHrKTp.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    genres: ['Action', 'Crime', 'Drama'],
    rating: 7.8,
    duration: 176,
    releaseDate: new Date('2022-03-04'),
    status: 'now-showing',
    director: 'Matt Reeves',
    language: 'English',
    cast: [
      { id: 'c8', name: 'Robert Pattinson', character: 'Bruce Wayne / Batman', imageUrl: 'https://image.tmdb.org/t/p/w200/8A4PS5iG7GWEAVFftyqS5S9Cnwi.jpg' },
      { id: 'c9', name: 'Zoë Kravitz', character: 'Selina Kyle', imageUrl: 'https://image.tmdb.org/t/p/w200/sEonRAJfz49kHMiLEvaAh5Bjb7Q.jpg' },
      { id: 'c10', name: 'Paul Dano', character: 'The Riddler', imageUrl: 'https://image.tmdb.org/t/p/w200/c56oVUgC5Av5qNBRPKTW6w3yLTj.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/mqqft2x_Aa4',
    showtimes: [
      { id: 's8', time: '12:00 PM', date: new Date(), theater: 'Screen 4', price: 320, available: true },
      { id: 's9', time: '04:00 PM', date: new Date(), theater: 'Screen 2', price: 350, available: true },
      { id: 's10', time: '08:30 PM', date: new Date(), theater: 'IMAX Screen 1', price: 480, available: true }
    ]
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
    id: '5',
    title: 'Godzilla x Kong: The New Empire',
    tagline: 'Rise together or fall alone',
    synopsis: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island\'s mysteries.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/veIyxxi5Gs8gvztLEW1Zsvg2pkw.jpg',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    rating: 7.2,
    duration: 115,
    releaseDate: new Date('2024-03-29'),
    status: 'now-showing',
    director: 'Adam Wingard',
    language: 'English',
    cast: [
      { id: 'c14', name: 'Rebecca Hall', character: 'Dr. Ilene Andrews', imageUrl: 'https://image.tmdb.org/t/p/w200/n1J7nxUlawTJLIeTyrrXMDpZGfD.jpg' },
      { id: 'c15', name: 'Brian Tyree Henry', character: 'Bernie Hayes', imageUrl: 'https://image.tmdb.org/t/p/w200/5pFMvwRKBMFChuzJwWfR8g6clEM.jpg' },
      { id: 'c16', name: 'Dan Stevens', character: 'Trapper', imageUrl: 'https://image.tmdb.org/t/p/w200/8mXUafExj5Vbe6P5m5Uvdr1XL7F.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/lV1OOlGwExM',
    showtimes: [
      { id: 's14', time: '11:30 AM', date: new Date(), theater: 'IMAX Screen 1', price: 500, available: true },
      { id: 's15', time: '03:30 PM', date: new Date(), theater: 'Screen 2', price: 380, available: true },
      { id: 's16', time: '07:00 PM', date: new Date(), theater: 'Screen 4', price: 350, available: true }
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
    id: '8',
    title: 'Joker: Folie à Deux',
    tagline: 'The world is a stage',
    synopsis: 'Arthur Fleck is institutionalized at Arkham awaiting trial for his crimes as Joker. While struggling with his dual identity, Arthur not only stumbles upon true love, but also finds the music that has always been inside him.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/aciP8Km0waTLXEYf5ybTO5ntgNM.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/reNf6GBzOe48l9WEnFOxXgW56Jl.jpg',
    genres: ['Drama', 'Thriller', 'Musical'],
    rating: 0,
    duration: 138,
    releaseDate: new Date('2024-10-04'),
    status: 'coming-soon',
    director: 'Todd Phillips',
    language: 'English',
    cast: [
      { id: 'c22', name: 'Joaquin Phoenix', character: 'Arthur Fleck / Joker', imageUrl: 'https://image.tmdb.org/t/p/w200/ls10fnzGz1PnRi0Duy4SHOU5bE0.jpg' },
      { id: 'c23', name: 'Lady Gaga', character: 'Harley Quinn', imageUrl: 'https://image.tmdb.org/t/p/w200/oy42yHxLVlYe1GVJwSZvFcqELPQ.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/TVi1E1ZqG9M',
    showtimes: []
  },
  {
    id: '9',
    title: 'Gladiator II',
    tagline: 'Return to glory',
    synopsis: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Coliseum as a gladiator and fight for his life.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg',
    genres: ['Action', 'Drama', 'History'],
    rating: 0,
    duration: 150,
    releaseDate: new Date('2024-11-22'),
    status: 'coming-soon',
    director: 'Ridley Scott',
    language: 'English',
    cast: [
      { id: 'c24', name: 'Paul Mescal', character: 'Lucius', imageUrl: 'https://image.tmdb.org/t/p/w200/ykd2GEZqXCZlL4q8g4X2bLLIqQD.jpg' },
      { id: 'c25', name: 'Denzel Washington', character: 'Macrinus', imageUrl: 'https://image.tmdb.org/t/p/w200/jj2Gcobpopokal0YstuCQW0ldJ4.jpg' },
      { id: 'c26', name: 'Pedro Pascal', character: 'Marcus Acacius', imageUrl: 'https://image.tmdb.org/t/p/w200/9VYK7oxcqhjd5LAH6ZFJxdv9QDf.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/4rgYUipGJNo',
    showtimes: []
  },
  {
    id: '10',
    title: 'Venom: The Last Dance',
    tagline: 'Til death do they part',
    synopsis: 'Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie\'s last dance.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 0,
    duration: 120,
    releaseDate: new Date('2024-10-25'),
    status: 'coming-soon',
    director: 'Kelly Marcel',
    language: 'English',
    cast: [
      { id: 'c27', name: 'Tom Hardy', character: 'Eddie Brock / Venom', imageUrl: 'https://image.tmdb.org/t/p/w200/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg' },
      { id: 'c28', name: 'Juno Temple', character: 'Dr. Teddy Paine', imageUrl: 'https://image.tmdb.org/t/p/w200/sYrklj1GtblZDiAnPcCFDTMEhqN.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/B9EPzCV16Ec',
    showtimes: []
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
  },
  {
    id: '12',
    title: 'Mission: Impossible 8',
    tagline: 'The final reckoning',
    synopsis: 'Ethan Hunt and his IMF team embark on their most dangerous mission yet as they face a powerful enemy threatening global security.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
    genres: ['Action', 'Thriller', 'Adventure'],
    rating: 0,
    duration: 163,
    releaseDate: new Date('2025-05-23'),
    status: 'coming-soon',
    director: 'Christopher McQuarrie',
    language: 'English',
    cast: [
      { id: 'c31', name: 'Tom Cruise', character: 'Ethan Hunt', imageUrl: 'https://image.tmdb.org/t/p/w200/8qBylBsQf4llkGrWR3qAsOtOU8O.jpg' },
      { id: 'c32', name: 'Hayley Atwell', character: 'Grace', imageUrl: 'https://image.tmdb.org/t/p/w200/pQBSdhwtzOTyqXF2GMwJg4DmxCW.jpg' }
    ],
    trailer: 'https://www.youtube.com/embed/avz06PDqDbM',
    showtimes: []
  }
];

export const HERO_BANNERS = [
  {
    id: 1,
    movieId: '1',
    title: 'Dune: Part Two',
    tagline: 'The epic conclusion to the saga',
    imageUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    ctaText: 'Book Now'
  },
  {
    id: 2,
    movieId: '7',
    title: 'Deadpool & Wolverine',
    tagline: 'The crossover event of the year',
    imageUrl: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    ctaText: 'Coming Soon'
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
