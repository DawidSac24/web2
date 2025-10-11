interface Pizza {
  id: number;
  title: string;
  content: string;
}

interface PizzaToUpdate {
  title?: string;
  content?: string;
}

type NewPizza = Omit<Pizza, "id">;

export type { Pizza, NewPizza, PizzaToUpdate };


export enum TextLevel {
  easy = "EASY",
  medium = "MEDIUM",
  hard = "HARD",
}

interface Text {
  id: string;
  content: string;
  level: TextLevel;
}

type NewText = Omit<Text, "id">;

export type { Text, NewText };
