import { Recipe } from "../models/recipe";
import { Wood } from "../cards/resources/wood";
import { Bridge } from "../cards/upgrades/bridge";

export const BridgeRecipe = new Recipe(Wood, Wood, Bridge);
