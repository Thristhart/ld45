import { Deck } from "../models/deck";
import { Tree } from "../cards/forest/tree";
import { StreamBed } from "../cards/forest/streambed";

export class Forest extends Deck {
  static displayName = "Forest";
  static artUrl = "./assets/decks/forest.jpg";
  // @ts-ignore
  static initialCards = [Tree, Tree, StreamBed, StreamBed, Tree, Tree, Tree, Tree, Tree, Tree];
}
