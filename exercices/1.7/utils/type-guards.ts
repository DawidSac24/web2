import { NewMovie, Movie } from "../types";

function isMovie(obj: any): obj is Movie {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.title === "string" &&
    typeof obj.director === "string" &&
    typeof obj.duration === "number" &&
    (obj.budget === undefined || typeof obj.budget === "number") &&
    (obj.description === undefined || typeof obj.description === "string") &&
    (obj.imageUrl === undefined || typeof obj.imageUrl === "string")
  );
}

function isNewMovie(obj: any): obj is NewMovie {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.title === "string" &&
    typeof obj.director === "string" &&
    typeof obj.duration === "number" &&
    (obj.budget === undefined || typeof obj.budget === "number") &&
    (obj.description === undefined || typeof obj.description === "string") &&
    (obj.imageUrl === undefined || typeof obj.imageUrl === "string")
  );
}


export { isNewMovie, isMovie }; /**
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
