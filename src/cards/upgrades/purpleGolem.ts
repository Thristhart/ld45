import { Golem } from "./golem";

export class PurpleGolem extends Golem {
  static displayName = "Purple Golem";
  static artUrl = "./assets/cards/purplegolem.jpg";
  static effect = {
    callback: () => {},
    description: "Consume a Rock and play a card every 4 seconds",
    needsFeedback: true,
  };

  cooldown = 4000;
}
