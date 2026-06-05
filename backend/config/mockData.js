export const mockGenres = {
  movieGenres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ],
  tvGenres: [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Mystery" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
    { id: 37, name: "Western" }
  ]
};

// Real TMDB image paths to make Mock mode visually indistinguishable
export const mockItems = [
  {
    id: 101,
    title: "Stranger Things",
    name: "Stranger Things",
    media_type: "tv",
    backdrop_path: "/56v2Afru6spH1n2Up8cuYc0jO2m.jpg",
    poster_path: "/x2LSR2fchvWjuUnGkhR8v3UrD6y.jpg",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    first_air_date: "2016-07-15",
    vote_average: 8.6,
    vote_count: 16500,
    genre_ids: [18, 9648, 10765],
    runtime_mock: "50m per episode",
    maturity_rating: "TV-14",
    trailer_key: "b9EkMc79ZSU"
  },
  {
    id: 102,
    title: "Dune: Part Two",
    name: "Dune: Part Two",
    media_type: "movie",
    backdrop_path: "/xOMo8jYZiR7r2vQ8GZJ6UIJT75w.jpg",
    poster_path: "/czembDcB205qb7U6apt012nIe5n.jpg",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 4700,
    genre_ids: [878, 12],
    runtime_mock: "2h 46m",
    maturity_rating: "PG-13",
    trailer_key: "Way9Dexny3w"
  },
  {
    id: 103,
    title: "Wednesday",
    name: "Wednesday",
    media_type: "tv",
    backdrop_path: "/iHh4297vP44f592phm6JQ72PPpv.jpg",
    poster_path: "/9pf9K12qK16nK7n6BQ6g5A6B9RI.jpg",
    overview: "Wednesday Addams, a student at Nevermore Academy, attempts to master her emerging psychic ability, thwart a monstrous killing spree, and solve the mystery that embroiled her parents.",
    first_air_date: "2022-11-23",
    vote_average: 8.5,
    vote_count: 7900,
    genre_ids: [35, 9648, 10765],
    runtime_mock: "45m per episode",
    maturity_rating: "TV-14",
    trailer_key: "Di310WS8zLk"
  },
  {
    id: 104,
    title: "Interstellar",
    name: "Interstellar",
    media_type: "movie",
    backdrop_path: "/rAiw0dhoyLN61peJg5qZ7g4hihL.jpg",
    poster_path: "/gEU2QvHOm56yv08PrUbbm22eRgh.jpg",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34000,
    genre_ids: [12, 18, 878],
    runtime_mock: "2h 49m",
    maturity_rating: "PG-13",
    trailer_key: "zSWdZVtXT7E"
  },
  {
    id: 105,
    title: "Squid Game",
    name: "Squid Game",
    media_type: "tv",
    backdrop_path: "/dK125OiH3yaM6t0d04R68NgoUa0.jpg",
    poster_path: "/d5NguwA1v2J1TAj7hiIuO5EXhdL.jpg",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    first_air_date: "2021-09-17",
    vote_average: 8.3,
    vote_count: 13000,
    genre_ids: [18, 9648, 10759],
    runtime_mock: "55m per episode",
    maturity_rating: "TV-MA",
    trailer_key: "oqxAJKy0R4I"
  },
  {
    id: 106,
    title: "Inception",
    name: "Inception",
    media_type: "movie",
    backdrop_path: "/8ZgRns4je5cc0vjGZ3uIEzw44go.jpg",
    poster_path: "/oYu2305ZzR6qkyg535B3agND3e3.jpg",
    overview: "Cobb, a skilled thief who steals valuable secrets from deep within the subconscious during the dream state, is offered a chance to have his history erased as payment for a seemingly impossible task: \"inception\".",
    release_date: "2010-07-14",
    vote_average: 8.4,
    vote_count: 35500,
    genre_ids: [28, 878, 12],
    runtime_mock: "2h 28m",
    maturity_rating: "PG-13",
    trailer_key: "YoHD9XEInc0"
  },
  {
    id: 107,
    title: "Breaking Bad",
    name: "Breaking Bad",
    media_type: "tv",
    backdrop_path: "/ggFHcrNu7t0TRGPGhxJzhj7gVpF.jpg",
    poster_path: "/ztkK61bj6J96847y2vCsuFWju4n.jpg",
    overview: "Walter White, a chemistry teacher, discovers he has cancer and decides to get into the meth-making business to repay his medical debts. His priorities begin to change when he partners with Jesse Pinkman.",
    first_air_date: "2008-01-20",
    vote_average: 8.9,
    vote_count: 14000,
    genre_ids: [18, 80],
    runtime_mock: "47m per episode",
    maturity_rating: "TV-MA",
    trailer_key: "HhesaQXLuRY"
  },
  {
    id: 108,
    title: "The Dark Knight",
    name: "The Dark Knight",
    media_type: "movie",
    backdrop_path: "/nMKdUUepdz8gflSq5T4t50n60St.jpg",
    poster_path: "/qJ2t4MRUB5mq0n74i3wKI7W32J.jpg",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 32000,
    genre_ids: [18, 80, 28, 53],
    runtime_mock: "2h 32m",
    maturity_rating: "PG-13",
    trailer_key: "EXeTwQWrcwY"
  },
  {
    id: 109,
    title: "Spider-Man: Across the Spider-Verse",
    name: "Spider-Man: Across the Spider-Verse",
    media_type: "movie",
    backdrop_path: "/4Hodj2QLXJ2nC2VMY2bCXEXYJ6f.jpg",
    poster_path: "/8Gxv2wSbs2eEXss9EV2wNy2jJ1C.jpg",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 6300,
    genre_ids: [16, 28, 12, 878],
    runtime_mock: "2h 20m",
    maturity_rating: "PG",
    trailer_key: "cqGjhVJWtEg"
  },
  {
    id: 110,
    title: "The Last of Us",
    name: "The Last of Us",
    media_type: "tv",
    backdrop_path: "/uDgy6hyPd32CH1wbhd1uH76G7jT.jpg",
    poster_path: "/uKvOHj6251j75n7Kj1924JjQj64.jpg",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.",
    first_air_date: "2023-01-15",
    vote_average: 8.6,
    vote_count: 4500,
    genre_ids: [18, 10759, 10765],
    runtime_mock: "1h per episode",
    maturity_rating: "TV-MA",
    trailer_key: "uLtkt8BonwM"
  },
  {
    id: 111,
    title: "Avatar: The Way of Water",
    name: "Avatar: The Way of Water",
    media_type: "movie",
    backdrop_path: "/8rpD7w2FeqJZU2l0upAiHB4snAd.jpg",
    poster_path: "/t6z2Z4ccjVj24srbo2eZuCX0d19.jpg",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, and the battles they fight to stay alive.",
    release_date: "2022-12-14",
    vote_average: 7.6,
    vote_count: 10800,
    genre_ids: [878, 12, 28],
    runtime_mock: "3h 12m",
    maturity_rating: "PG-13",
    trailer_key: "d9MyW72ELq0"
  },
  {
    id: 112,
    title: "The Boys",
    name: "The Boys",
    media_type: "tv",
    backdrop_path: "/n5A7br05Vz3u2V2rR4Ay4t4C52f.jpg",
    poster_path: "/7NsNAv6o1L2GZ3acVdiGj8o8iIk.jpg",
    overview: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers and fame.",
    first_air_date: "2019-07-25",
    vote_average: 8.5,
    vote_count: 9800,
    genre_ids: [10765, 10759, 18],
    runtime_mock: "1h per episode",
    maturity_rating: "TV-MA",
    trailer_key: "M1bhOaLvCqg"
  },
  {
    id: 113,
    title: "Oppenheimer",
    name: "Oppenheimer",
    media_type: "movie",
    backdrop_path: "/fm6t5aCrznZ73ceFYwRN9gj7OI5.jpg",
    poster_path: "/8Gxv2wSbs2eEXss9EV2wNy2jJ1C.jpg",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 8900,
    genre_ids: [18, 36],
    runtime_mock: "3h",
    maturity_rating: "R",
    trailer_key: "uYPbbksJxIg"
  },
  {
    id: 114,
    title: "Joker",
    name: "Joker",
    media_type: "movie",
    backdrop_path: "/n6bUie0tm7g1ur7C74k5626HIrZ.jpg",
    poster_path: "/udDclsv60jI6uAav58VPP2GvX65.jpg",
    overview: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
    release_date: "2019-10-02",
    vote_average: 8.2,
    vote_count: 24500,
    genre_ids: [80, 53, 18],
    runtime_mock: "2h 2m",
    maturity_rating: "R",
    trailer_key: "zAGVQLHvwOY"
  },
  {
    id: 115,
    title: "The Mandalorian",
    name: "The Mandalorian",
    media_type: "tv",
    backdrop_path: "/9z7tXMLOswJhyEeiechn3Cc3n2B.jpg",
    poster_path: "/e3NnC1w76b27d252EgNAJH4bjgc.jpg",
    overview: "After the fall of the Galactic Empire, a lone gunfighter makes his way through the outer reaches of the lawless galaxy.",
    first_air_date: "2019-11-12",
    vote_average: 8.4,
    vote_count: 9800,
    genre_ids: [10765, 10759],
    runtime_mock: "40m per episode",
    maturity_rating: "TV-14",
    trailer_key: "aOC8E8z_Ifw"
  }
];

export const getMockCast = (id) => [
  { id: 1, name: "Pedro Pascal", character: "Lead", profile_path: "/95146u5Zc1u7K8y5Zc1u7K8y.jpg" },
  { id: 2, name: "Millie Bobby Brown", character: "Co-Lead", profile_path: "/5Zc1u7K8y5Zc1u7K8y5Zc1u.jpg" },
  { id: 3, name: "Cillian Murphy", character: "Supporting", profile_path: "/7K8y5Zc1u7K8y5Zc1u7K8y5.jpg" },
  { id: 4, name: "Zendaya", character: "Supporting", profile_path: "/8y5Zc1u7K8y5Zc1u7K8y5Zc.jpg" }
];

export const getMockVideos = (id) => {
  const item = mockItems.find(i => i.id === Number(id));
  const key = item?.trailer_key || "dQw4w9WgXcQ"; // Fallback to Rickroll if not found
  return {
    results: [
      {
        id: "vid1",
        key,
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer"
      }
    ]
  };
};

export const getMockDetails = (id) => {
  const item = mockItems.find(i => i.id === Number(id));
  if (!item) return null;
  return {
    ...item,
    genres: item.genre_ids.map(gId => mockGenres.movieGenres.find(g => g.id === gId) || { id: gId, name: "Genre" }),
    runtime: item.runtime_mock.includes("h") ? parseInt(item.runtime_mock.split("h")[0]) * 60 + (item.runtime_mock.includes("m") ? parseInt(item.runtime_mock.split("h")[1]) : 0) : 45,
    tagline: "Experience the phenomenon.",
    status: "Released",
    backdrop_path: item.backdrop_path,
    poster_path: item.poster_path,
  };
};
