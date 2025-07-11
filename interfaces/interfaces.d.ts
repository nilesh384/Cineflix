interface Movie {
  id: number;
  title: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  media_type?: string;
  first_air_date?: string; 
  name?: string;
}

interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
  vote_average: number;
  media_type?: string; // Optional, for TV shows
}

interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget?: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id?: string | null;
  original_language: string;
  original_title?: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date?: string;
  first_air_date?: string;
  last_air_date?: string;
  revenue?: number;
  runtime?: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title?: string;
  name?: string; // for TV shows
  video: boolean;
  vote_average: number;
  vote_count: number;

  // 🔥 Additions for TV shows
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
}


interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
  media_type?: string; // Optional, for TV shows
}

interface MovieTrailer {
  id: string;
  name: string;
  key: string; // YouTube video key
  site: string;
  size: number;
  type: "Trailer";
  official: boolean;
  published_at: string;
}

interface Poster {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

interface Person {
  profile_path?: string | null;
  name: string;
  known_for_department?: string;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string;
  also_known_as?: string[];
  biography?: string;
  homepage?: string;
}

interface PersonPicture {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}


interface PersonMovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  media_type: 'movie' | 'tv';
  character: string;
}

interface PersonTvCredit {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  character: string;
  media_type: 'tv';
}
