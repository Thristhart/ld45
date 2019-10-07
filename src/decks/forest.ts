import { Deck } from "../models/deck";
import { Tree } from "../cards/forest/tree";
import { StreamBed } from "../cards/forest/streambed";
import { Cave } from "../cards/forest/cave";

export class Forest extends Deck {
  static displayName = "Forest";
  static artUrl = "./assets/decks/forest.jpg";
  // @ts-ignore
  static initialCards = [Tree];
  static initialCardAddQueue = [Tree, Tree, StreamBed, Tree, Tree, StreamBed]; // Cave, Tree, StreamBed, Tree(and then just Caves all the way down?)
  static initialCardsAllowed = new Set([Tree]);
  static defaultCardAdd = Cave;
}
