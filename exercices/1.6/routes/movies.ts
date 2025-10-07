import { Router, Request, Response } from "express";

import path from "node:path";
import { Movie } from "../types";
import { parse } from "../utils/json";
import { isNewMovie, isPartialNewMovie } from "../utils/type-guards";
const router = Router();

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

router.get("/", (req: Request, res: Response) => {
  const minimumDuration = Number(req.query["minimum-duration"]);
  console.log("Query received:", req.query);

  const movies: Movie[] = parse(jsonDbPath, defaultMovies);

  // Vérifie si minimumDuration est un nombre valide
  if (!isNaN(minimumDuration)) {
    const filteredMovies = movies.filter(
      (movie) => movie.duration >= minimumDuration,
    );
    return res.json(filteredMovies);
  }

  // Si aucun filtre ou filtre invalide, retourne tous les films
  return res.json(movies);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const movies: Movie[] = parse(jsonDbPath, defaultMovies);
  const movie: Movie | undefined = movies.find((movie) => movie.id === id);

  if (!movie) {
    return res.sendStatus(404);
  }

  return res.json(movie);
});

router.post("/", (req: Request, res: Response) => {
  const body: unknown = req.body;

  if (!isNewMovie(body)) {
    return res.sendStatus(400);
  }
  const { title, director, duration, budget, description, imageUrl } = body;

  const movies: Movie[] = parse(jsonDbPath, defaultMovies);
  const nextId =
    movies.reduce((maxId, movie) => (movie.id > maxId ? movie.id : maxId), 0) +
    1;

  const newMovie: Movie = {
    id: nextId,
    title,
    director,
    duration,
    budget,
    description,
    imageUrl,
  };

  movies.push(newMovie);
  return res.json(newMovie);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const movies: Movie[] = parse(jsonDbPath, defaultMovies);
  const movie: Movie | undefined = movies.find((movie) => movie.id === id);

  if (!movie) {
    return res.sendStatus(404);
  }

  movies.slice(movie.id);
  defaultMovies.slice(movie.id);

  return res.json(movie);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const movieIndex = defaultMovies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.sendStatus(404);
  }

  const body: unknown = req.body;

  if (!isPartialNewMovie(body)) {
    return res.sendStatus(400);
  }

  const { title, director, duration, budget, description, imageUrl } = body;

  const movie = defaultMovies[movieIndex];

  if (title) {
    movie.title = title;
  }
  if (director) {
    movie.director = director;
  }
  if (duration !== undefined) {
    movie.duration = duration;
  }
  if (budget !== undefined) {
    movie.budget = budget;
  }
  if (description !== undefined) {
    movie.description = description;
  }
  if (imageUrl !== undefined) {
    movie.imageUrl = imageUrl;
  }

  return res.json(movie);
});
export default router;
