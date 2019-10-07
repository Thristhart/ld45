import { Recipe } from "../models/recipe";
import React, { useRef } from "react";
import "./recipe.css";
import { CardComponent } from "./card";

interface RecipeProps {
  recipe: Recipe;
}
export const RecipeComponent = (props: RecipeProps) => {
  const { recipe } = props;

  const ref = useRef();

  recipe.element = ref.current;

  return (
    <div className="recipe" ref={ref}>
      <span className="recipeName">{recipe.result.displayName}</span>
      <section className="content">
        <div className="dropzone left">
          <div className="bgContainer">
            <img src={recipe.leftCard.artUrl} className="background"></img>
            <span className="dropTitle">{recipe.leftCard.displayName}</span>
          </div>
          {recipe.leftCardCurrent && <CardComponent card={recipe.leftCardCurrent}></CardComponent>}
        </div>
        <span className="plus">+</span>
        <div className="dropzone right">
          <div className="bgContainer">
            <img src={recipe.rightCard.artUrl} className="background"></img>
            <span className="dropTitle">{recipe.rightCard.displayName}</span>
          </div>
          {recipe.rightCardCurrent && <CardComponent card={recipe.rightCardCurrent}></CardComponent>}
        </div>
        <span className="equals">=</span>
        <div className="dropzone result">
          <div className="bgContainer">
            <img src={recipe.result.artUrl} className="background"></img>
            <span className="dropTitle">{recipe.result.displayName}</span>
          </div>
          {recipe.crafted && <CardComponent card={recipe.crafted}></CardComponent>}
        </div>
      </section>
    </div>
  );
};
