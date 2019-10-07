import { Recipe } from "../models/recipe";
import { BlueGem } from "../cards/resources/blueGem";
import { PurpleGem } from "../cards/resources/purpleGem";
import { StoneRefining } from "../cards/upgrades/stoneRefining";

export const StoneRefiningRecipe = new Recipe(BlueGem, PurpleGem, StoneRefining);
