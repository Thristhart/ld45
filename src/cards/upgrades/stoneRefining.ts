import { Card } from "../../models/card";
import { cards } from "../../state";
import { StreamBed } from "../forest/streambed";

export class StoneRefining extends Card {
  static displayName = "Stone Refining";
  static artUrl = "./assets/cards/stonerefining.jpg";
  static effect = {
    callback: () => {
      StreamBed.upgradeTier++;
    },
    description: "Improve stone refining techniques. +1 Rock from Streambeds",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
