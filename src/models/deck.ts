import { Card } from "./card";
import shuffle from "shuffle-array";
import { forceUpdate } from "..";

export class Deck {
  static initialCards: (typeof Card)[];
  static initialCardAddQueue: (typeof Card)[];
  static initialCardsAllowed: Set<typeof Card>;
  static displayName: string;
  static artUrl: string;

  static _nextId = 0;

  locked: boolean;
  cards: Card[];
  cardAddQueue: (typeof Card)[];
  cardsAllowed: Set<typeof Card>;
  discard: Card[];
  id: string;

  constructor(public position: { x: number; y: number }) {
    this.cards = shuffle((this.constructor as typeof Deck).initialCards, { copy: true }).map(
      (CardClass) => new CardClass(this.position)
    );
    this.discard = [];
    this.id = "deck" + Deck._nextId++;
    this.cardAddQueue = Deck.initialCardAddQueue;
    this.cardsAllowed = Deck.initialCardsAllowed;
  }

  addNextCard() {
    let cardType = this.cardAddQueue.find((cardType) => this.cardsAllowed.has(cardType));
    if (cardType !== undefined) this.addCard(cardType);
  }

  addCard(cardType: typeof Card) {
    this.cards.push(new cardType(this.position));
    forceUpdate();
  }
}

export function getClassFromDeck(foo: Deck) {
  return foo.constructor as typeof Deck;
}
