import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { AudioControl } from "./audio";
import { cards, decks, miscState, recipes } from "./state";
import { CardComponent } from "./components/card";

import "./index.css";
import { Quest } from "./decks/quests";
import { DeckComponent } from "./components/deck";
import { loadCards } from "./preloadCards";
import { RecipeComponent } from "./components/recipe";

decks.push(new Quest({ x: 0, y: 0 }));

export let forceUpdate: () => void;
export let setCardPreview: (foo: any, id: string) => void;

let isMovingCamera = false;

const onMouseUp = () => {
  if (isMovingCamera) {
    isMovingCamera = false;
    document.body.style.cursor = "initial";
  }
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div = card.div;

    card.position = { x: card.position.x + miscState.dragTransform.x, y: card.position.y + miscState.dragTransform.y };

    div.style.transform = `skew(3deg)`;
    forceUpdate();

    miscState.dragTransform = { x: 0, y: 0 };
    miscState.draggedCard = null;
  }
};
const onMouseMove = (e) => {
  if (e.target.id === "container" && !isMovingCamera) {
    document.body.style.cursor = "grab";
  } else if (!isMovingCamera) {
    document.body.style.cursor = "initial";
  }
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div = card.div;

    let transform = { x: miscState.dragTransform.x + e.movementX, y: miscState.dragTransform.y + e.movementY };
    miscState.dragTransform = transform;

    const transformString = `translate(${transform.x}rem, ${transform.y}rem) skew(3deg)`;
    div.style.transform = transformString;
  } else if (isMovingCamera) {
    miscState.cameraPos = {
      x: miscState.cameraPos.x + e.movementX,
      y: miscState.cameraPos.y + e.movementY,
    };

    document.documentElement.style.setProperty("--cameraX", miscState.cameraPos.x + "rem");
    document.documentElement.style.setProperty("--cameraY", miscState.cameraPos.y + "rem");
  }
};

const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const target = event.target as HTMLElement;
  if (target.id === "container") {
    document.body.style.cursor = "grabbing";
    isMovingCamera = true;
  }
};

const onMouseEnterUi = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div: HTMLElement = card.div;

    const ui = document.getElementById("ui");

    if (!ui.contains(div)) {
      const bounding = div.getBoundingClientRect();
      div.style.top = bounding.top + "rem";
      div.style.left = bounding.left + "rem";
      miscState.dragTransform = { x: 0, y: 0 };
      ui.appendChild(div);
    }

    let transform = { x: miscState.dragTransform.x + e.movementX, y: miscState.dragTransform.y + e.movementY };
    miscState.dragTransform = transform;

    const transformString = `translate(${transform.x}rem, ${transform.y}rem) skew(3deg)`;
    div.style.transform = transformString;
  }
};

const onMouseUpUi = () => {
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div = card.div;
  }
};

const onMouseExitUi = () => {
  console.log("mouse exit UI");
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div = card.div;
    const bounding = div.getBoundingClientRect();
    card.position = {
      x: bounding.left - (64.5 + 180) - miscState.cameraPos.x,
      y: bounding.top - 85.875 - miscState.cameraPos.y,
    };
    document.getElementById("field").appendChild(div);
    forceUpdate();
  }
};

let lastPreviewId = "";

let loaded = false;
const load = async () => {
  const loaders = [AudioControl.loadedAudio, loadCards()];

  await Promise.all(loaders);

  loaded = true;

  forceUpdate();
};

load();

const App = () => {
  const [_, stateHack] = useState();
  const [preview, setPreview] = useState(null);

  forceUpdate = useCallback(() => stateHack({}), []);
  setCardPreview = useCallback((preview: any, id: string) => {
    if (preview && lastPreviewId !== id) {
      AudioControl.hover.play();
    }
    if (preview) {
      lastPreviewId = id;
    }
    if (lastPreviewId === id) {
      setPreview(preview);
    }
  }, []);

  if (!loaded) {
    return <div style={{ fontSize: "64em" }}>Loading...</div>;
  }

  return (
    <>
      <div id="container" onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseDown={onMouseDown}>
        <section id="field">
          {decks.map((deck) => (
            <DeckComponent deck={deck} key={deck.id} />
          ))}
          {cards.map((card) => (
            <CardComponent card={card} key={card.id} />
          ))}
        </section>
        <section id="ui" onMouseEnter={onMouseEnterUi} onMouseUp={onMouseUpUi} onMouseLeave={onMouseExitUi}>
          <div id="recipes">
            {recipes.map((recipe) => (
              <RecipeComponent recipe={recipe} key={recipe.result.displayName} />
            ))}
          </div>
          {preview}
        </section>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
