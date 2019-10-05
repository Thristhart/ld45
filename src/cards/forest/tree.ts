import { Card } from "../../models/card";
import { decks, cards } from "../../state";
import { Wood } from "../../cards/resources/wood";

export class Tree extends Card {
  static displayName = "Tree";
  static artUrl = "./assets/cards/tree.jpg";
  static effect = {
    callback: (card: Tree) => {
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      cards.push(new Wood(newPos));
    },
    description: "Take a Wood",
    needsFeedback: false,
  };
}
