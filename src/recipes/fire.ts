import { Recipe } from "../models/recipe";
import { Wood } from "../cards/resources/wood";
import { Rock } from "../cards/resources/rock";
import { MakeFire } from "../cards/recipe/makeFire";

export const FireRecipe = new Recipe(Wood, Rock, MakeFire);
