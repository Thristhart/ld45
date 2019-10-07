import { Card } from "../../models/card";
import { cards } from "../../state";
import { GreenGolem } from "../upgrades/greenGolem";

export class MakeGreenGolem extends Card {
  static displayName = "Green Golem";
  static artUrl = "./assets/cards/purplegolem.jpg";
  static effect = {
    callback: () => {
      cards.push(new GreenGolem({ x: 150, y: 240 }));
    },
    description: "Craft a Green Golem. This one is raring to go.",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
