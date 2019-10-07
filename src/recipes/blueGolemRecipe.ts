import { Recipe } from "../models/recipe";
import { Magic } from "../cards/resources/magic";
import { BlueGem } from "../cards/resources/blueGem";
import { MakeBlueGolem } from "../cards/recipe/makeBlueGolem";

export const BlueGolemRecipe = new Recipe(Magic, BlueGem, MakeBlueGolem);
