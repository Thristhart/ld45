import { Recipe } from "../models/recipe";
import { Magic } from "../cards/resources/magic";
import { GreenGem } from "../cards/resources/greenGem";
import { MakeGreenGolem } from "../cards/recipe/makeGreenGolem";

export const GreenGolemRecipe = new Recipe(Magic, GreenGem, MakeGreenGolem);
