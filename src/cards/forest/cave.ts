import { Card } from "../../models/card";
import { cards, gameProgress, decks, questFlags, stacks } from "../../state";
import { Torch } from "../resources/torch";
import { AudioControl } from "../../audio";
import { Mine } from "../../decks/mine";
import { Rock } from "../resources/rock";
import { BlueGem } from "../resources/blueGem";
import { forceUpdate, dropCard } from "../..";

export class Cave extends Card {
  static displayName = "Cave";
  static artUrl = "./assets/cards/cave.jpg";
  static requirements = {
    validate: () => {
      return !!(
        cards.find((card) => card instanceof Torch) ||
        stacks.find((stack) => stack.find((card) => card instanceof Torch))
      );
    },
    description: "Consume a Torch.",
  };
  static effect = {
    callback: (card: Cave) => {
      if (Cave.upgradeTier == 1) {
        let torchI = cards.findIndex((card) => card instanceof Torch);
        if (torchI !== -1) {
          cards.splice(torchI, 1);
        } else {
          const stackWithTorch = stacks.find((stack) => stack.find((card) => card instanceof Torch));
          const torch = stackWithTorch.find((card) => card instanceof Torch);
          torch.remove();
        }
        gameProgress.caveExploration += 1;
        if (gameProgress.caveExploration >= 8) {
          questFlags.hasReachedMines = true;
          gameProgress.caveExploration = 8;
          decks.push(new Mine({ x: 629, y: -220 }));
          AudioControl.mine.play();
        } else {
          AudioControl.cave.play();
        }
      } else {
        let cardType = Math.random() * 10 >= 1 ? Rock : BlueGem;
        let newPos = { x: card.position.x - 8, y: card.position.y - 180 };
        const newCard = new cardType(newPos);
        cards.push(newCard);
        forceUpdate();
        dropCard(newCard);
      }
    },
    description: "Take a Look.",
    needsFeedback: false,
  };
}
