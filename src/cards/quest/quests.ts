import { Card } from "../../models/card";

export class IntroQuest extends Card {
  static displayName = "The First Quest";
  static artUrl = "./assets/cards/quest1.jpg";
  static requirements = {
    validate: () => {
      return true;
    },
    description: "Draw a card from the Quest deck"
  };
  static effect = {
    callback: () => {
      console.log("get +1 forest");
    },
    description: "Discover the Forest deck"
  }
}