import { Card } from "../../models/card";
import { cards } from "../../state";
import { PurpleGolem } from "../upgrades/purpleGolem";

export class MakePurpleGolem extends Card {
  static displayName = "Purple Golem";
  static artUrl = "./assets/cards/purplegolem.jpg";
  static effect = {
    callback: () => {
      cards.push(new PurpleGolem({ x: 150, y: 240 }));
    },
    description: "Craft a Purple Golem. This one is a little more enthusiastic.",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
