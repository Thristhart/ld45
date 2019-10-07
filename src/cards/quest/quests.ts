import { Card } from "../../models/card";
import { Forest } from "../../decks/forest";
import { Quest } from "../../decks/quests";
import { decks, questFlags, recipes, cards, stacks } from "../../state";
import { AudioControl } from "../../audio";
import { StreamBed } from "../forest/streambed";
import { FireRecipe } from "../../recipes/fire";
import { Cave } from "../forest/cave";
import { TorchRecipe } from "../../recipes/torch";
import { Guardian } from "../forest/guardian";
import { Tree } from "../forest/tree";
import { GolemRecipe } from "../../recipes/golem";
import { Rock } from "../resources/rock";
import { Mine } from "../../decks/mine";
import { MakeGreenGolem } from "../recipe/makeGreenGolem";
import { MakeBlueGolem } from "../recipe/makeBlueGolem";
import { StoneRefiningRecipe } from "../../recipes/stonerefining";
import { PurpleGolemRecipe } from "../../recipes/purpleGolemRecipe";
import { BlueGolemRecipe } from "../../recipes/blueGolemRecipe";
import { GreenGolemRecipe } from "../../recipes/greenGolemRecipe";
import { GreenGemMaker } from "../mine/greengem";

export class BaseQuest extends Card {
  isQuest = true;
}

export class IntroQuest extends BaseQuest {
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
        const questDeck = decks.find((deck) => deck instanceof Quest);
        questDeck.addCard(CraftingQuest);
        questDeck.draw();
      }, 700);
    },
    description: "Discover the Forest deck",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class CraftingQuest extends BaseQuest {
  static displayName = "Putting It Together";
  static artUrl = "./assets/cards/crafting.jpg";
  static requirements = {
    validate: () => {
      return questFlags.hasCrafted;
    },
    description: "Craft Something",
  };
  static effect = {
    callback: () => {
      let forest = decks.find((deck) => deck instanceof Forest);
      forest.cardsAllowed.add(StreamBed);
      forest.addCard(StreamBed);
      recipes.push(FireRecipe);
      setTimeout(() => {
        let quests = decks.find((deck) => deck instanceof Quest);
        quests.addCard(FireQuest);
        quests.draw();
      }, 700);
      //TODO: Add next quest or two.
    },
    description: "Unlock Streambeds in the Forest and the Fire recipe",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class FireQuest extends BaseQuest {
  static displayName = "Firestarter";
  static artUrl = "./assets/cards/firequest.jpg";
  static requirements = {
    validate: () => {
      return questFlags.hasCraftedFire;
    },
    description: "Craft Fire",
  };
  static effect = {
    callback: () => {
      recipes.push(TorchRecipe);
      setTimeout(() => {
        let quests = decks.find((deck) => deck instanceof Quest);
        quests.addCard(ExpansionQuest);
        quests.draw();
      }, 700);
    },
    description: "Unlock the Torch recipe",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class ExpansionQuest extends BaseQuest {
  static displayName = "Going The Distance";
  static artUrl = "./assets/cards/goingthedistancequest.jpg";
  static requirements = {
    validate: () => {
      let out = false;
      for (let deck of decks) {
        if (deck.cards.length >= 8) {
          out = true;
        }
      }
      return out;
    },
    description: "Have 8 cards in a single deck.",
  };
  static effect = {
    callback: () => {
      let forest = decks.find((deck) => deck instanceof Forest);
      forest.cardsAllowed.add(Cave);
      forest.addCard(Guardian);
      forest.addCard(Tree);
      forest.addCard(Cave);
      setTimeout(() => {
        let quests = decks.find((deck) => deck instanceof Quest);
        quests.addCard(MagicQuest);
        quests.draw();
      }, 700);
    },
    description: "Bridges in the Forest now add Caves. Batulathil awakens.",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class MagicQuest extends BaseQuest {
  static displayName = "The Gathering";
  static artUrl = "./assets/cards/magicquest.jpg";
  static requirements = {
    validate: () => {
      return questFlags.hasGatheredMagic;
    },
    description: "Find Magic",
  };
  static effect = {
    callback: () => {
      recipes.push(GolemRecipe);
      setTimeout(() => {
        let quests = decks.find((deck) => deck instanceof Quest);
        quests.addCard(ThroughQuest);
      }, 700);
    },
    description: "Unlock the Golem recipe",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class ThroughQuest extends BaseQuest {
  static displayName = "Break On Through";
  static artUrl = "./assets/cards/breakingthrough.jpg";
  static requirements = {
    validate: () => {
      return questFlags.hasReachedMines;
    },
    description: "Reach the other side of the Caves",
  };
  static effect = {
    callback: () => {
      Cave.upgradeTier++;
      setTimeout(() => {
        let quests = decks.find((deck) => deck instanceof Quest);
        quests.addCard(GemQuest);
      }, 700);
    },
    description: "Caves now give Rocks and Rock-like substances.",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class GemQuest extends BaseQuest {
  static displayName = "Under Pressure";
  static artUrl = "./assets/cards/gemquest.jpg";
  static requirements = {
    validate: () => {
      return questFlags.hasSeenPurple;
    },
    description: "Find the Treasure in the Mine",
  };
  static effect = {
    callback: () => {
      recipes.push(StoneRefiningRecipe);
      setTimeout(() => {
        let quests = decks.find((deck) => deck instanceof Quest);
        quests.addCard(RockQuest);
      }, 700);
    },
    description: "Unlock the Stone Refining recipe",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class RockQuest extends BaseQuest {
  static displayName = "I Love Rock and Roll";
  static artUrl = "./assets/cards/rocks100.jpg";
  static requirements = {
    validate: () => {
      const countFree = cards.filter((card) => card instanceof Rock).length;
      const rockStacks = stacks.filter((stack) => stack.find((card) => card instanceof Rock));
      const countInStack = rockStacks.reduce<number>((total, stack) => {
        return stack.filter((card) => card instanceof Rock).length + total;
      }, 0);

      return countInStack > 100;
    },
    description: "Accumulate 100 Rocks",
  };
  static effect = {
    callback: () => {
      recipes.push(PurpleGolemRecipe);
      recipes.push(BlueGolemRecipe);
      recipes.push(GreenGolemRecipe);
      let mine = decks.find((deck) => deck instanceof Mine);
      mine.cardsAllowed.add(GreenGemMaker);
      mine.addCard(GreenGemMaker);
      setTimeout(() => {
        let quests = decks.find((deck) => deck instanceof Quest);
        quests.addCard(FinalQuest);
      }, 700);
    },
    description: "Advanced Golem Recipes, and a new Gem in the Mines.",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}

class FinalQuest extends BaseQuest {
  static displayName = "Respect";
  static artUrl = "./assets/cards/statue.jpg";
  static requirements = {
    validate: () => {
      const countFree = cards.filter((card) => card instanceof Rock).length;
      const rockStacks = stacks.filter((stack) => stack.find((card) => card instanceof Rock));
      const countInStack = rockStacks.reduce<number>((total, stack) => {
        return stack.filter((card) => card instanceof Rock).length + total;
      }, 0);

      return countInStack > 10000;
    },
    description: "Accumulate 10000 Rocks",
  };
  static effect = {
    callback: () => {
      cards.splice(0, cards.length);
      cards.push(new Guardian({ x: 0, y: 0 }));
      AudioControl.grove_guardian.play();
      decks.splice(0, cards.length);
    },
    description: "Create a monument to Batulathil",
    needsFeedback: true,
  };
  static destroysOnPlay = true;
}
