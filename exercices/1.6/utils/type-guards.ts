import { NewMovie, Movie } from "../types";

const isNewMovie = (body: unknown): body is NewMovie => {
  if (!body || typeof body !== "object") {
    return false;
  }

  const movie = body as Record<string, unknown>;

  if (
    typeof movie.title !== "string" ||
    typeof movie.director !== "string" ||
    typeof movie.duration !== "number" ||
    (movie.budget !== undefined && typeof movie.budget !== "number") ||
    (movie.description !== undefined &&
      typeof movie.description !== "string") ||
    (movie.imageUrl !== undefined && typeof movie.imageUrl !== "string") ||
    !movie.title.trim() ||
    !movie.director.trim()
  ) {
    return false;
  }

  return true;
};

const isMovie = (body: unknown): body is Movie => {
  if (!body || typeof body !== "object") {
    return false;
  }

  const movie = body as Record<string, unknown>;

  if (
    typeof movie.id !== "number" ||
    typeof movie.title !== "string" ||
    typeof movie.director !== "string" ||
    typeof movie.duration !== "number" ||
    (movie.budget !== undefined && typeof movie.budget !== "number") ||
    (movie.description !== undefined &&
      typeof movie.description !== "string") ||
    (movie.imageUrl !== undefined && typeof movie.imageUrl !== "string") ||
    !movie.title.trim() ||
    !movie.director.trim()
  ) {
    return false;
  }

  return true;
};

const isPartialNewMovie = (body: unknown): body is Partial<NewMovie> => {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const movie = body as Record<string, unknown>;

  if (
    ("title" in movie &&
      (typeof movie.title !== "string" || !movie.title.trim())) ||
    ("director" in movie &&
      (typeof movie.director !== "string" || !movie.director.trim())) ||
    ("duration" in movie && typeof movie.duration !== "number") ||
    ("budget" in movie && typeof movie.budget !== "number") ||
    ("description" in movie && typeof movie.description !== "string") ||
    ("imageUrl" in movie && typeof movie.imageUrl !== "string")
  ) {
    return false;
  }

  return true;
};

export { isNewMovie, isMovie, isPartialNewMovie }; /**
 * This file contains type guards for typescript
 * @param value
 * @returns
 */

import { NewPizza } from "../types";

/**
 * Check if the value is a string and inform typescript of this
 * @param value
 * @returns
 */
const isString = (value: unknown): value is string => {
  return typeof value === "string" || value instanceof String;
};

/* Check if the value is a number and inform typescript of this */
const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && isFinite(value);
};

/**
 * Check if the body is a new pizza
 * @param body
 * @returns boolean
 */
const isNewPizza = (body: unknown): body is NewPizza => {
  if (
    !body ||
    typeof body !== "object" ||
    !("title" in body) ||
    !("content" in body) ||
    body.title !== "string" ||
    body.content !== "string" ||
    !body.title.trim() ||
    !body.content.trim()
  ) {
    return false;
  }

  return true;
};

export { isString, isNumber, isNewPizza };
