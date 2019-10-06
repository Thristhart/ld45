import { Deck } from "./models/deck";
import { Card } from "./models/card";
import { Recipe } from "./models/recipe";
import { BridgeRecipe } from "./recipes/bridge";

export const decks: Deck[] = [];

export const cards: Card[] = [];

export const recipes: Recipe[] = [BridgeRecipe];

export const miscState = {
  draggedCard: null,
  dragTransform: { x: 0, y: 0 },
  cameraPos: { x: 0, y: 0 },
};
