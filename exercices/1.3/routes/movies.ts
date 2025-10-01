import { Router, Request, Response } from "express";

import path from "node:path";
import { Movie, NewMovie } from "../types";
import { parse } from "../utils/json";
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
    duration: 114
  },
];

router.get("/", (req: Request, res: Response) => {
  const minimumDuration = Number(req.query["minimum-duration"]);
  console.log("Query received:", req.query);

  const movies: Movie[] = parse(jsonDbPath, defaultMovies);

  // Vérifie si minimumDuration est un nombre valide
  if (!isNaN(minimumDuration)) {
    const filteredMovies = movies.filter((movie) => movie.duration >= minimumDuration);
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

function isValidNewMovie(body: unknown): body is NewMovie {
  return (
    typeof body === "object" &&
    body !== null  && 
    "title" in body &&
    "director" in body &&
    "duration" in body &&
    typeof (body as any).title === "string" &&
    typeof (body as any).director === "string" &&
    typeof (body as any).duration === "number" &&
    (body as any).duration > 0
  );
}

router.post("/", (req: Request, res: Response) => {
  const body: unknown = req.body;

  if (!isValidNewMovie(body)) {
    return res.sendStatus(400);
  }
  const { title, director, duration, budget, description, imageUrl } = body as NewMovie;

  const movies: Movie[] = parse(jsonDbPath, defaultMovies);
  const nextId = movies.reduce((maxId, movie) => (movie.id > maxId ? movie.id : maxId), 0) + 1;

  const newMovie: Movie = {
    id: nextId,
    title,
    director,
    duration,
    budget,
    description,
    imageUrl
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

  movies.slice(movie.id)

  return res.json(movie);
});

export default router;
