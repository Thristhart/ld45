import { Recipe } from "../models/recipe";
import React from "react";
import "./recipe.css";

interface RecipeProps {
  recipe: Recipe;
}
export const RecipeComponent = (props: RecipeProps) => {
  const { recipe } = props;

  return (
    <div className="recipe">
      <span className="recipeName">{recipe.result.displayName}</span>
      <section className="content">
        <div className="dropzone">
          <img src={recipe.leftCard.artUrl}></img>
          <span className="title">{recipe.leftCard.displayName}</span>
        </div>
        <span className="plus">+</span>
        <div className="dropzone">
          <img src={recipe.rightCard.artUrl}></img>
          <span className="title">{recipe.rightCard.displayName}</span>
        </div>
        <span className="equals">=</span>
        <div className="dropzone result">
          <img src={recipe.result.artUrl}></img>
          <span className="title">{recipe.result.displayName}</span>
        </div>
      </section>
    </div>
  );
};
