const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const searchMovies = async ({ search, type }) => {
  if (search === '') return null;

  let url = `${API_URL}&s=${search}`;
  if (type) {
    url += `&type=${type}`;
  }

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.Response === 'False') {
      throw new Error(json.Error);
    }

    const movies = json.Search;

    return movies?.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster
    }));

  } catch (e) {
    throw new Error(e.message || 'Error searching movies');
  }
};

export const getMovieById = async ({ id }) => {
  if (!id) return null;

  try {
    const response = await fetch(`${API_URL}&i=${id}`);
    const json = await response.json();

    if (json.Response === 'False') {
      throw new Error(json.Error);
    }

    // Mapeamos los datos que nos interesan
    // (Los nombres de las propiedades vienen con mayúscula)
    const {
      imdbID, Title, Year, Poster, Plot, Genre,
      Runtime, Director, Actors, imdbRating, Metascore
    } = json;

    return {
      id: imdbID,
      title: Title,
      year: Year,
      poster: Poster,
      plot: Plot,
      genre: Genre,
      runtime: Runtime,
      director: Director,
      actors: Actors,
      rating: imdbRating,
      metascore: Metascore
    };
  } catch (e) {
    throw new Error(e.message || 'Error fetching movie details');
  }
};