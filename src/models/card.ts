import { cards, stacks } from "../state";
import { forceUpdate } from "..";
import { BaseQuest } from "../cards/quest/quests";
import { AudioControl } from "../audio";

export class Card {
  static displayName: string;
  static artUrl: string;
  static effect?: Effect;
  static requirements?: Requirement;
  static recipe?: Card[];
  static destroysOnPlay: boolean;
  static upgradeTier: number = 1;

  static _nextId = 0;

  constructor(public position: { x: number; y: number }) {
    this.id = "card" + Card._nextId++;
  }

  waitingForFeedback?: boolean;
  destroying?: boolean;
  div?: HTMLDivElement;
  id: string;
  owner: any; // fuck it
  wasPlayed: boolean = false;

  play() {
    this.wasPlayed = true;
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
    if (
      cardType.effect &&
      ((cardType.requirements && cardType.requirements.validate(this)) || !cardType.requirements)
    ) {
      if (cardType.effect.needsFeedback) {
        this.waitingForFeedback = true;
        if ("isQuest" in this) {
          AudioControl.quest_complete.play();
        }
      } else {
        this.play();
      }
    }
    forceUpdate();
  }
  remove() {
    if (cards.indexOf(this) !== -1) {
      cards.splice(cards.indexOf(this), 1);
    }
    if (this.owner) {
      this.owner.removeCard && this.owner.removeCard(this);
      this.owner.splice && this.owner.splice(this.owner.indexOf(this), 1);
      // this is the worst
      if ("length" in this.owner && this.owner.length === 1) {
        stacks.splice(stacks.indexOf(this.owner), 1);
        cards.push(this.owner[0]);
        this.owner[0].owner = null;
      }
      this.owner = null;
    }
    forceUpdate();
  }

  animateTo(newPos: { x: number; y: number }) {
    const diff = { x: newPos.x - this.position.x, y: newPos.y - this.position.y };

    const oldTransform = this.div.style.transform;
    const oldTransition = this.div.style.transition;
    setTimeout(() => {
      this.div.style.transition = "transform 500ms linear";
      this.div.style.transform = `translate(${diff.x}rem, ${diff.y}rem)`;
    }, 16);
    setTimeout(() => {
      this.div.style.transform = oldTransform;
      this.div.style.transition = oldTransition;
      this.position.x = newPos.x;
      this.position.y = newPos.y;
      forceUpdate();
    }, 500);
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
