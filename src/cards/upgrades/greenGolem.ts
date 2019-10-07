import { Golem } from "./golem";

export class GreenGolem extends Golem {
  static displayName = "Green Golem";
  static artUrl = "./assets/cards/greengolem.jpg";
  static effect = {
    callback: () => {},
    description: "Consume a Rock and play a card every second",
    needsFeedback: true,
  };

  cooldown = 1000;
}
