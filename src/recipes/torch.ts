import { Recipe } from "../models/recipe";
import { Wood } from "../cards/resources/wood";
import { Fire } from "../cards/resources/fire";
import { MakeTorch } from "../cards/recipe/makeTorch";

export const TorchRecipe = new Recipe(Wood, Fire, MakeTorch);
TorchRecipe.rightConsumed = false;
