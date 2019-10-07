import { Card } from "../../models/card";
import { cards } from "../../state";
import { Golem } from "../upgrades/golem";

export class MakeGolem extends Card {
  static displayName = "Golem";
  static artUrl = "./assets/cards/golem.jpg";
  static effect = {
    callback: () => {
      cards.push(new Golem({ x: 150, y: 240 }));
    },
    description: "Craft a Golem",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
