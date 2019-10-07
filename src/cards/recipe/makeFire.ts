import { Card } from "../../models/card";
import { cards, questFlags } from "../../state";
import { Fire } from "../resources/fire";

export class MakeFire extends Card {
  static displayName = "Fire";
  static artUrl = "./assets/cards/makefire.jpg";
  static effect = {
    callback: () => {
      cards.push(new Fire({ x: 8, y: 240 }));
      questFlags.hasCraftedFire = true;
    },
    description: "Gives you Fire",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
