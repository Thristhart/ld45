import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { cards, decks } from "./state";
import { CardComponent } from "./components/card";

import "./index.css";
import { Quests } from "./decks/quests";
import { DeckComponent } from "./components/deck";

decks.push(new Quests({x: 20, y: 20}));


export const StateUpdateContext = React.createContext(() => {});

const App = () => {
  const [_, stateHack] = useState();
  const forceUpdate = useCallback(() => stateHack({}), []);

  return <StateUpdateContext.Provider value={forceUpdate}>
    {decks.map((deck, index) => <DeckComponent deck={deck} key={index} />)}
    {cards.map((card, index) => <CardComponent card={card} key={index} />)}
  </StateUpdateContext.Provider>;
}

ReactDOM.render(<App />, document.getElementById("app"));