import { Card } from "../../models/card";
import { cards } from "../../state";
import { Torch } from "../resources/torch";
import { dropCard, forceUpdate } from "../..";

export class MakeTorch extends Card {
  static displayName = "Torch";
  static artUrl = "./assets/cards/maketorch.jpg";
  static effect = {
    callback: () => {
      const torch = new Torch({ x: 8, y: 240 });
      cards.push(torch);
      forceUpdate();
      dropCard(torch);
    },
    description: "Light a Torch",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
