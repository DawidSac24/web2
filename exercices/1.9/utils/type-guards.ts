/**
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

import { NewText, Text, TextLevel } from "../types";

// --- Checks a complete Text object ---
function isText(obj: any): obj is Text {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.content === "string" &&
    isValidTextLevel(obj.level)
  );
}

// --- Checks a new Text object (without id) ---
function isNewText(obj: any): obj is NewText {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.content === "string" &&
    isValidTextLevel(obj.level)
  );
}

// --- Checks a partial update (PATCH) ---
function isPartialNewText(obj: any): obj is Partial<NewText> {
  if (!obj || typeof obj !== "object") return false;

  const allowedKeys = ["content", "level"];
  for (const key of Object.keys(obj)) {
    if (!allowedKeys.includes(key)) return false;

    const val = (obj as any)[key];
    switch (key) {
      case "content":
        if (typeof val !== "string" || !val.trim()) return false;
        break;
      case "level":
        if (!isValidTextLevel(val)) return false;
        break;
    }
  }

  return true;
}

function isValidTextLevel(level: unknown): level is TextLevel {
  return (
    typeof level === "string" &&
    Object.values(TextLevel).includes(level as TextLevel)
  );
}

export { isText, isNewText, isPartialNewText };

import { version } from "uuid";
import { validate } from "uuid";

function isValidUuid(uuid: string) {
  return validate(uuid) && version(uuid) === 1;
}

export { isValidUuid };