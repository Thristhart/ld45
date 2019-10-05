import { Card } from "../../models/card";
import { decks, cards } from "../../state";
import { Rock } from "../../cards/resources/rock";

export class StreamBed extends Card {
  static displayName = "Stream Bed";
  static artUrl = "./assets/cards/streambed.jpg";
  static effect = {
    callback: (card: StreamBed) => {
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      cards.push(new Rock(newPos));
    },
    description: "Take a Rock",
    needsFeedback: false,
  };
}
