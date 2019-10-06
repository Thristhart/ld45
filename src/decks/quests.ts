import { Deck } from "../models/deck";
import { IntroQuest } from "../cards/quest/quests";

export class Quest extends Deck {
  static displayName = "Quests";
  static artUrl = "./assets/decks/quests.jpg";
  static initialCards = [IntroQuest];
}
