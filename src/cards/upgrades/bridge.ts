import { Card } from "../../models/card";

import { decks } from "../../state";
import { Forest } from "../../decks/forest";

export class Bridge extends Card {
  static displayName = "Bridge";
  static artUrl = "./assets/cards/bridge.jpg";
  static effect = {
    callback: () => {
      decks.find((deck) => deck instanceof Forest).addNextCard();
    },
    description: "Adds a card to the Forest Deck",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
