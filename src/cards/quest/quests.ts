import { Card } from "../../models/card";
import { Forest } from "../../decks/forest";
import { Quest } from "../../decks/quests";
import { decks } from "../../state";
import { AudioControl } from "../../audio";

export class IntroQuest extends Card {
  static displayName = "The First Quest";
  static artUrl = "./assets/cards/quest1.jpg";
  static requirements = {
    validate: () => {
      return true;
    },
    description: "Draw a card from the Quest deck",
  };
  static effect = {
    callback: () => {
      decks.push(new Forest({ x: -320, y: -220 }));
      AudioControl.discover_forest.play();
      setTimeout(() => {
        decks.find((deck) => deck instanceof Quest).addCard(CraftingQuest);
      }, 700);
      //TODO: Show crafting.
    },
    description: "Discover the Forest deck",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class CraftingQuest extends Card {
  static displayName = "Putting It Together";
  static artUrl = "./assets/cards/crafting.jpg";
  static requirements = {
    validate: () => {
      return true;
    },
    description: "Craft Something",
  };
  static effect = {
    callback: () => {
      //TODO:
      //TODO: Add next quest or two.
    },
    description: "Discover the Forest deck",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
