import path from "node:path";
import { Text, NewText, TextLevel } from "../types";
import { parse, serialize } from "../utils/json";
const jsonDbPath = path.join(__dirname, "/../data/texts.json");
import { v1 as uuidv1 } from "uuid";

const defaultTexts: Text[] = [
  {
    id: "1",
    content: "Text 1",
    level: TextLevel.easy,
  },
  {
    id: "2",
    content: "Text 2",
    level: TextLevel.medium,
  },
  {
    id: "3",
    content: "Text 3",
    level: TextLevel.hard,
  },
];

function readAllTexts(level: TextLevel | undefined): Text[] {
  const texts = parse(jsonDbPath, defaultTexts);
  if (!level) {
    return texts;
  }

  const filteredTexts = texts.filter((text) => {
    return text.level === level;
  });
  return filteredTexts;
}

function readOneText(id: string): Text | undefined {
  const texts = parse(jsonDbPath, defaultTexts);
  const text = texts.find((text) => (text.id === id));
  if (!text) {
    return undefined;
  }

  return text;
}

function createOneText(newText: NewText): Text {
  const texts = parse(jsonDbPath, defaultTexts);

  const newId = uuidv1();

  const createdText = {
    id: newId,

    ...newText,
  };

  texts.push(createdText);

  serialize(jsonDbPath, texts);

  return createdText;
}

function deleteOneText(id: string): Text | undefined {
  const texts = parse(jsonDbPath, defaultTexts);
  const index = texts.findIndex((text) => text.id === id);

  if (index === -1) {
    return undefined;
  }

  const deletedElements = texts.splice(index, 1);

  serialize(jsonDbPath, texts);

  return deletedElements[0];
}

function updateOneText(
  textId: string,
  newText: Partial<NewText>
): Text | undefined {
  const texts = parse(jsonDbPath, defaultTexts);

  const idx = texts.findIndex((m) => m.id === textId);
  if (idx === -1) return undefined;

  const text = texts[idx];

  if (newText.content !== undefined) text.content = newText.content;
  if (newText.level !== undefined) text.level = newText.level;

  // explicit replace (safer and clearer)
  texts[idx] = text;
  serialize(jsonDbPath, texts);

  return text;
}

export {
  readAllTexts,
  readOneText,
  createOneText,
  deleteOneText,
  updateOneText,
};