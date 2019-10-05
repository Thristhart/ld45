import { Card } from "../../models/card";
import { Forest } from "../../decks/forest";
import { decks } from "../../state";

export class IntroQuest extends Card {
  static displayName = "The First Quest";
  static artUrl = "./assets/cards/quest1.jpg";
  static requirements = {
    validate: () => {
      return true;
    },
    description: "Draw a card from the Quest deck",
  };
  static effect = {
    callback: () => {
      decks.push(new Forest({ x: 520, y: 200 }));
      //TODO: Add next quest or two.
      //TODO: Show crafting.;
    },
    description: "Discover the Forest deck",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
