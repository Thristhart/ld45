import { Card } from "../../models/card";
import { questFlags, cards } from "../../state";
import { Rock } from "../resources/rock";
import { forceUpdate, dropCard } from "../..";

export class RockMaker extends Card {
  static displayName = "Rock";
  static artUrl = "./assets/cards/rock.jpg";
  static effect = {
    callback: (card: RockMaker) => {
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      const newCard = new Rock(newPos);
      cards.push(newCard);
      forceUpdate();
      dropCard(newCard);
    },
    description: "Get a Rock",
    needsFeedback: false,
  };
}
