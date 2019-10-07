import { Deck } from "../models/deck";
import { Tree } from "../cards/forest/tree";
import { StreamBed } from "../cards/forest/streambed";
import { Rock } from "../cards/resources/rock";
import { PurpleGemMaker } from "../cards/mine/purplegem";

export class Mine extends Deck {
  static displayName = "Mine";
  static artUrl = "./assets/decks/mine.jpg";
  // @ts-ignore
  static initialCards = [
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    Rock,
    PurpleGemMaker,
  ];
  static initialCardAddQueue = [];
  static initialCardsAllowed = new Set([Rock, PurpleGemMaker]);
  static defaultCardAdd = Rock;
}
