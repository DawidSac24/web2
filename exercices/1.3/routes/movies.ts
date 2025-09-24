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
    if (req.query.order && typeof req.query.order !== "string") {
    return res.sendStatus(400);
  }

  const movies = parse(jsonDbPath, defaultMovies);

  return res.json(movies);
});

export default router;