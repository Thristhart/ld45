import { Card } from "../../models/card";
import { cards } from "../../state";

export class MakeStoneRefining extends Card {
  static displayName = "Stone Refining";
  static artUrl = "./assets/cards/stonerefining.jpg";
  static effect = {
    callback: () => {
      // TODO: improve stone output
    },
    description: "Improve stone refining techniques. +1 Rock from Streambeds",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
