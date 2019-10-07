import { Card } from "./card";
import shuffle from "shuffle-array";
import { forceUpdate } from "..";

export class Deck {
  static initialCards: (typeof Card)[];
  static initialCardAddQueue: (typeof Card)[];
  static initialCardsAllowed: Set<typeof Card>;
  static defaultCardAdd: typeof Card;
  static displayName: string;
  static artUrl: string;

  static _nextId = 0;

  locked: boolean;
  cards: Card[];
  cardAddQueue: (typeof Card)[];
  cardsAllowed: Set<typeof Card>;
  discard: Card[];
  id: string;

  draw: () => void;

  constructor(public position: { x: number; y: number }) {
    const type = this.constructor as typeof Deck;
    this.cards = shuffle(type.initialCards, { copy: true }).map((CardClass) => new CardClass(this.position));
    this.discard = [];
    this.id = "deck" + Deck._nextId++;
    this.cardAddQueue = type.initialCardAddQueue;
    this.cardsAllowed = type.initialCardsAllowed;
  }

  addNextCard() {
    const filter = (cardType) => this.cardsAllowed.has(cardType);
    let cardType = this.cardAddQueue.find(filter);
    let cardIndex = this.cardAddQueue.findIndex(filter);
    if (!cardType) {
      cardType = Array.from(this.cardsAllowed).pop();
    }
    this.addCard(cardType);
    this.cardAddQueue.splice(cardIndex, 1);
  }

  addCard(cardType: typeof Card) {
    this.cards.push(new cardType(this.position));
    forceUpdate();
  }
}

export function getClassFromDeck(foo: Deck) {
  return foo.constructor as typeof Deck;
}
