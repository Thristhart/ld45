import { cards } from "../state";
import { forceUpdate } from "..";

export class Card {
  static displayName: string;
  static artUrl: string;
  static effect?: Effect;
  static requirements?: Requirement;
  static recipe?: Card[];
  static destroysOnPlay: boolean;

  constructor(public position: { x: number; y: number }) {}

  waitingForFeedback?: boolean;
  destroying?: boolean;
  div?: HTMLDivElement;

  play() {
    const cardType = getClassFromCard(this);
    if (cardType.effect) {
      cardType.effect.callback(this);
    }
    if (cardType.destroysOnPlay) {
      this.destroying = true;
    }
    forceUpdate();
  }
  performEffect() {
    const cardType = getClassFromCard(this);
    if ((cardType.requirements && cardType.requirements.validate(this)) || !cardType.requirements) {
      if (cardType.effect.needsFeedback) {
        this.waitingForFeedback = true;
      } else {
        this.play();
      }
    }
    forceUpdate();
  }
  remove() {
    cards.splice(cards.indexOf(this));
    forceUpdate();
  }
}

export function getClassFromCard(foo: Card) {
  return foo.constructor as typeof Card;
}

export interface Effect {
  callback: (card: Card) => void;
  description: string;
  needsFeedback?: boolean;
}

export interface Requirement {
  validate: (card: Card) => boolean;
  description: string;
}
