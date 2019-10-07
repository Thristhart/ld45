import { Card } from "../../models/card";
import { cards } from "../../state";
import { BlueGolem } from "../upgrades/blueGolem";

export class MakeBlueGolem extends Card {
  static displayName = "Blue Golem";
  static artUrl = "./assets/cards/bluegolem.jpg";
  static effect = {
    callback: () => {
      cards.push(new BlueGolem({ x: 150, y: 240 }));
    },
    description: "Craft a Blue Golem. This one is trying.",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
