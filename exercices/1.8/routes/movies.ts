import { Router, Request, Response } from "express";

import { Movie, NewMovie } from "../types";
import { isNewMovie, isPartialNewMovie } from "../utils/type-guards";
import {
  readAllMovies,
  readOneMovie,
  createOneMovie,
  deleteOneMovie,
  updateOneMovie,
} from "../services/movies";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  const minimumDuration = Number(req.query["minimum-duration"]);
  console.log("Query received:", req.query);

  const movies = readAllMovies(minimumDuration);

  // Si aucun filtre ou filtre invalide, retourne tous les films
  return res.json(movies);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const movie: Movie | undefined = readOneMovie(id);

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

  const newMovie: Movie = createOneMovie(body);

  return res.json(newMovie);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  const movie = deleteOneMovie(id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Return the deleted movie
  return res.status(200).json(movie);
});

router.patch("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid movie ID" });

  const body: unknown = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Missing or invalid request body" });
  }

  // validate only the fields supplied (PATCH semantics)
  if (!isPartialNewMovie(body)) {
    return res.status(400).json({ error: "Invalid fields in request body" });
  }

  const payload = body as Partial<NewMovie>;

  const updatedMovie: Movie | undefined = updateOneMovie(id, payload);

  if (!updatedMovie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  return res.status(200).json(updatedMovie);
});

export default router;
