import { Card } from "../../models/card";

export class Golem extends Card {
  static displayName = "Golem";
  static artUrl = "./assets/cards/golem.jpg";
  static requirements = {
    validate: (card: Card) => {
      return !!card.owner;
    },
    description: "Place next to a deck",
  };
  static effect = {
    callback: () => {},
    description: "Consume a Rock and play a card every 15 seconds",
    needsFeedback: true,
  };

  interval: NodeJS.Timeout;
  cooldown = 15000;
}
