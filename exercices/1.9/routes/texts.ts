import { Router, Request, Response } from "express";

import { Text, NewText, TextLevel } from "../types";
import { isNewText, isPartialNewText, isValidUuid } from "../utils/type-guards";
import {
  readAllTexts,
  readOneText,
  createOneText,
  deleteOneText,
  updateOneText,
} from "../services/texts";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  const levelParam = req.query["level"];
  console.log("Query received:", req.query);

  let level: TextLevel | undefined;

  // Validate the "level" query parameter
  if (typeof levelParam === "string") {
    const upper = levelParam.toUpperCase();

    if (Object.values(TextLevel).includes(upper as TextLevel)) {
      level = upper as TextLevel;
    } else {
      return res.status(400).json({
        error: `Invalid level. Must be one of: ${Object.values(TextLevel).join(
          ", "
        )}`,
      });
    }
  }

  const texts = readAllTexts(level);

  return res.json(texts);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);

  if (!isValidUuid(id)) {
    return res.sendStatus(400);
  }

  const text: Text | undefined = readOneText(id);

  if (!text) {
    return res.sendStatus(404);
  }

  return res.json(text);
});

router.post("/", (req: Request, res: Response) => {
  const body: unknown = req.body;

  if (!isNewText(body)) {
    return res.sendStatus(400);
  }

  const newText: Text = createOneText(body);

  return res.json(newText);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);

  if (!isValidUuid(id)) {
    return res.sendStatus(400);
  }

  const text = deleteOneText(id);

  if (!text) {
    return res.status(404).json({ error: "Text not found" });
  }

  // Return the deleted text
  return res.status(200).json(text);
});

router.patch("/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!isValidUuid(id)) {
    return res.sendStatus(400);
  }
  const body: unknown = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Missing or invalid request body" });
  }

  // validate only the fields supplied (PATCH semantics)
  if (!isPartialNewText(body)) {
    return res.status(400).json({ error: "Invalid fields in request body" });
  }

  const payload = body as Partial<NewText>;

  const updatedText: Text | undefined = updateOneText(id, payload);

  if (!updatedText) {
    return res.status(404).json({ error: "Text not found" });
  }

  return res.status(200).json(updatedText);
});

export default router;
