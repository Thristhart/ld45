import { Deck } from "./models/deck";
import { Card } from "./models/card";
import { Recipe } from "./models/recipe";
import { BridgeRecipe } from "./recipes/bridge";

export const decks: Deck[] = [];

export const cards: Card[] = [];

export const stacks: Card[][] = [];

export const recipes: Recipe[] = [BridgeRecipe];

export const miscState = {
  draggedCard: null,
  dragTransform: { x: 0, y: 0 },
  dragStartPos: { x: 0, y: 0 },
  cameraPos: { x: 0, y: 0 },
};

export const gameProgress = {
  caveExploration: 0,
};

export const questFlags = {
  hasCrafted: false,
  hasCraftedFire: false,
  hasGatheredMagic: false,
  hasReachedMines: false,
  hasSeenPurple: false,
};

//@ts-ignore
window.debug = {
  miscState,
  questFlags,
  gameProgress,
  cards,
  stacks,
  recipes,
};
