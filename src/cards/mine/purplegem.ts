import { Card } from "../../models/card";
import { questFlags, cards } from "../../state";
import { PurpleGem } from "../resources/purpleGem";
import { forceUpdate, dropCard } from "../..";

export class PurpleGemMaker extends Card {
  static displayName = "Purple Gem";
  static artUrl = "./assets/cards/purplegem.jpg";
  static effect = {
    callback: (card: PurpleGemMaker) => {
      questFlags.hasSeenPurple = true;
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      const newCard = new PurpleGem(newPos);
      cards.push(newCard);
      forceUpdate();
      dropCard(newCard);
    },
    description: "Get a Purple Gem",
    needsFeedback: false,
  };
}
