import { Card } from "../../models/card";
import { decks, cards, questFlags } from "../../state";
import { AudioControl } from "../../audio";
import { Wood } from "../resources/wood";
import { Magic } from "../resources/magic";
import { dropCard, forceUpdate } from "../..";

export class Guardian extends Card {
  static displayName = "Batulathil, Grove Guardian";
  static artUrl = "./assets/cards/magic_tree.jpg";
  static requirements = {
    validate: () => !cards.find((card) => card instanceof Wood),
    description: "There is no Wood on the field",
  };
  static effect = {
    callback: (card: Guardian) => {
      let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
      const newCard = new Magic(newPos);
      cards.push(newCard);
      forceUpdate();
      dropCard(newCard);
      AudioControl.grove_guardian.play();
      questFlags.hasGatheredMagic = true;
    },
    description: "Gain Magic",
    needsFeedback: false,
  };
}
