import { Recipe } from "../models/recipe";
import { Rock } from "../cards/resources/rock";
import { Magic } from "../cards/resources/magic";
import { MakeGolem } from "../cards/recipe/makeGolem";

export const GolemRecipe = new Recipe(Magic, Rock, MakeGolem);
