import { Card } from "../../models/card";
import { decks, cards } from "../../state";
import { Wood } from "../../cards/resources/wood";
import { AudioControl } from "../../audio";
import { dropCard, forceUpdate } from "../..";

export class Tree extends Card {
  static displayName = "Tree";
  static artUrl = "./assets/cards/tree.jpg";
  static effect = {
    callback: (card: Tree) => {
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      const newCard = new Wood(newPos);
      cards.push(newCard);
      forceUpdate();
      dropCard(newCard);
      AudioControl.wood.play();
      document.getElementById("recipes").classList.add("show");
    },
    description: "Take a Wood",
    needsFeedback: false,
  };
}
