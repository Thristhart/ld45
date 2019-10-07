import { Golem } from "./golem";

export class BlueGolem extends Golem {
  static displayName = "Blue Golem";
  static artUrl = "./assets/cards/bluegolem.jpg";
  static effect = {
    callback: () => {},
    description: "Consume a Rock and play a card every nine seconds",
    needsFeedback: true,
  };

  cooldown = 9000;
}
