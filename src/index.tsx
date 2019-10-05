import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { cards, decks, miscState } from "./state";
import { CardComponent } from "./components/card";

import "./index.css";
import { Quests } from "./decks/quests";
import { DeckComponent } from "./components/deck";

decks.push(new Quests({ x: 200, y: 200 }));

export let forceUpdate: () => void;
export let setCardPreview: (foo: any) => void;

const onMouseUp = () => {
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
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div = card.div;

    let transform = { x: miscState.dragTransform.x + e.movementX, y: miscState.dragTransform.y + e.movementY };
    miscState.dragTransform = transform;

    const transformString = `translate(${transform.x}rem, ${transform.y}rem) skew(3deg)`;
    div.style.transform = transformString;
  }
};

const App = () => {
  const [_, stateHack] = useState();
  const [preview, setPreview] = useState(null);

  forceUpdate = useCallback(() => stateHack({}), []);
  setCardPreview = useCallback((preview: any) => setPreview(preview), []);
  return (
    <div id="container" onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      {decks.map((deck, index) => (
        <DeckComponent deck={deck} key={index} />
      ))}
      {cards.map((card, index) => (
        <CardComponent card={card} key={index} />
      ))}
      {preview}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
