import { Recipe } from "../models/recipe";
import { PurpleGem } from "../cards/resources/purpleGem";
import { Magic } from "../cards/resources/magic";
import { MakePurpleGolem } from "../cards/recipe/makePurpleGolem";

export const PurpleGolemRecipe = new Recipe(Magic, PurpleGem, MakePurpleGolem);
