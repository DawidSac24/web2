import { Router, Request, Response } from "express";

import path from "node:path";
import { Movie } from "../types";
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

export default router;
