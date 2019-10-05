import { Card } from "./card";
import shuffle from "shuffle-array";

export class Deck {
  static initialCards: (typeof Card)[];
  static displayName: string;
  static artUrl: string;


  constructor(public position: {x: number, y: number}) {
    this.cards = shuffle((this.constructor as typeof Deck).initialCards, {copy: true}).map(CardClass => new CardClass(this.position));
  }

  locked: boolean;
  cards: Card[];
}

export function getClassFromDeck(foo: Deck) {
  return foo.constructor as typeof Deck;
}