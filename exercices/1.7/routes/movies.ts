import { Router, Request, Response } from "express";

import path from "node:path";
import { Movie, NewMovie } from "../types";
import { parse } from "../utils/json";
import { isNewMovie } from "../utils/type-guards";
import { serialize } from "../utils/json";
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
      (movie) => movie.duration >= minimumDuration
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

  if (!isNewMovie(body))  {
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
  serialize(jsonDbPath, movies);
  return res.json(newMovie);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  // Load movies
  const movies: Movie[] = parse(jsonDbPath, defaultMovies);

  // Find movie by ID
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Remove the movie from the list
  const updatedMovies = movies.filter((m) => m.id !== id);

  // Save the updated list
  serialize(jsonDbPath, updatedMovies);

  // Return the deleted movie
  return res.status(200).json(movie);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  const movies: Movie[] = parse(jsonDbPath, defaultMovies);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  const body: unknown = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    ("title" in body &&
      (typeof (body as any).title !== "string" ||
        !(body as any).title.trim())) ||
    ("director" in body &&
      (typeof (body as any).director !== "string" ||
        !(body as any).director.trim())) ||
    ("duration" in body &&
      (typeof (body as any).duration !== "number" ||
        (body as any).duration <= 0)) ||
    ("budget" in body &&
      (typeof (body as any).budget !== "number" ||
        (body as any).budget <= 0)) ||
    ("description" in body &&
      (typeof (body as any).description !== "string" ||
        !(body as any).description.trim())) ||
    ("imageUrl" in body &&
      (typeof (body as any).imageUrl !== "string" ||
        !(body as any).imageUrl.trim()))
  ) {
    return res.status(400).json({ error: "Invalid movie update data" });
  }

  const {
    title,
    director,
    duration,
    budget,
    description,
    imageUrl,
  }: Partial<NewMovie> = body as Partial<NewMovie>;

  // Apply updates
  if (title) movie.title = title;
  if (director) movie.director = director;
  if (duration) movie.duration = duration;
  if (budget) movie.budget = budget;
  if (description) movie.description = description;
  if (imageUrl) movie.imageUrl = imageUrl;

  // Replace movie in the array correctly
  const index = movies.findIndex((m) => m.id === id);
  movies[index] = movie;

  serialize(jsonDbPath, movies);

  return res.status(200).json(movie);
});

export default router;
