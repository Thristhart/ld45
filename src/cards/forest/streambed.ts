import { Card } from "../../models/card";
import { decks, cards } from "../../state";
import { Rock } from "../../cards/resources/rock";
import { AudioControl } from "../../audio";
import { dropCard, forceUpdate } from "../..";

export class StreamBed extends Card {
  static displayName = "Stream Bed";
  static artUrl = "./assets/cards/streambed.jpg";
  static effect = {
    callback: (card: StreamBed) => {
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      for (let i = 0; i < StreamBed.upgradeTier; i++) {
        const card = new Rock(newPos);
        cards.push(card);
        forceUpdate();
        dropCard(card);
      }
      AudioControl.rock.play();
    },
    description: "Take a Rock",
    needsFeedback: false,
  };
}
