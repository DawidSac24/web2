import path from "node:path";
import { Movie, NewMovie } from "../types";
import { parse, serialize } from "../utils/json";
const jsonDbPath = path.join(__dirname, "/../data/movies.json");

const defaultMovies: Movie[] = [
  {
    id: 1,
    title: "Fight Club",
    director: "David Fincher",
    duration: 139,
  },
  {
    id: 2,
    title: "Se7en",
    director: "David Fincher",
    duration: 127,
  },
  {
    id: 3,
    title: "Taxi Driver",
    director: "martin Scorese",
    duration: 114,
  },
];

function readAllMovies(minDuration: number): Movie[] {
  const movies = parse(jsonDbPath, defaultMovies);
  if (!minDuration) {
    return movies;
  }

  const minDurationNumber = Number(minDuration);

  const filteredMovies = movies.filter((drink) => {
    return drink.duration > minDurationNumber;
  });
  return filteredMovies;
}

function readOneMovie(id: number): Movie | undefined {
  const movies = parse(jsonDbPath, defaultMovies);
  const movie = movies.find((movie) => (movie.id = id));
  if (!movie) {
    return undefined;
  }

  return movie;
}

function createOneMovie(newMovie: NewMovie): Movie {
  const movies = parse(jsonDbPath, defaultMovies);

  const nextId =
    movies.reduce((maxId, movie) => (movie.id > maxId ? movie.id : maxId), 0) +
    1;

  const createdMovie = {
    id: nextId,

    ...newMovie,
  };

  movies.push(createdMovie);

  serialize(jsonDbPath, movies);

  return createdMovie;
}

function deleteOneMovie(id: number): Movie | undefined {
  const movies = parse(jsonDbPath, defaultMovies);
  const index = movies.findIndex((movie) => movie.id === id);

  if (index === -1) {
    return undefined;
  }

  const deletedElements = movies.splice(index, 1);

  serialize(jsonDbPath, movies);

  return deletedElements[0];
}


function updateOneMovie(
  movieId: number,
  newMovie: Partial<NewMovie>
): Movie | undefined {
  const movies = parse(jsonDbPath, defaultMovies);

  const idx = movies.findIndex((m) => m.id === movieId);
  if (idx === -1) return undefined;

  const movie = movies[idx];

  if (newMovie.title !== undefined) movie.title = newMovie.title;
  if (newMovie.director !== undefined) movie.director = newMovie.director;
  if (newMovie.duration !== undefined) movie.duration = newMovie.duration;
  if (newMovie.budget !== undefined) movie.budget = newMovie.budget;
  if (newMovie.description !== undefined)
    movie.description = newMovie.description;
  if (newMovie.imageUrl !== undefined) movie.imageUrl = newMovie.imageUrl;

  // explicit replace (safer and clearer)
  movies[idx] = movie;
  serialize(jsonDbPath, movies);

  return movie;
}

export { readAllMovies, readOneMovie, createOneMovie, deleteOneMovie, updateOneMovie };
