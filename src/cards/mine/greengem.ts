import { Card } from "../../models/card";
import { GreenGem } from "../resources/greenGem";
import { cards } from "../../state";
import { forceUpdate, dropCard } from "../..";

export class GreenGemMaker extends Card {
  static displayName = "Green Gem";
  static artUrl = "./assets/cards/greengem.jpg";
  static effect = {
    callback: (card: GreenGemMaker) => {
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      const newCard = new GreenGem(newPos);
      cards.push(newCard);
      forceUpdate();
      dropCard(newCard);
    },
    description: "Get a Green Gem",
    needsFeedback: false,
  };
}
