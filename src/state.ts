import { Deck } from "./models/deck";
import { Card } from "./models/card";

export const decks: Deck[] = [];

export const cards: Card[] = [];

export const miscState = {
  draggedCard: null,
  dragTransform: { x: 0, y: 0 },
};
