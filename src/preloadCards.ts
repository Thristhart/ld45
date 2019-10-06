import { Quest } from "./decks/quests";
import { Forest } from "./decks/forest";
import { IntroQuest } from "./cards/quest/quests";
import { Tree } from "./cards/forest/tree";
import { Wood } from "./cards/resources/wood";
import { StreamBed } from "./cards/forest/streambed";
import { Rock } from "./cards/resources/rock";

function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", resolve);
    image.addEventListener("error", reject);
    image.src = src;
  });
}

export async function loadCards() {
  return Promise.all([
    loadImage(Quest.artUrl),
    loadImage(Forest.artUrl),
    loadImage(IntroQuest.artUrl),
    loadImage(Tree.artUrl),
    loadImage(Wood.artUrl),
    loadImage(StreamBed.artUrl),
    loadImage(Rock.artUrl),
  ]);
}
