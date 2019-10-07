import { Card, getClassFromCard } from "./card";
import { questFlags, cards } from "../state";
import { forceUpdate } from "..";
import { AudioControl } from "../audio";

export class Recipe {
  leftConsumed: boolean = true;
  rightConsumed: boolean = true;
  crafted: Card;

  element?: HTMLElement;

  constructor(public leftCard: typeof Card, public rightCard: typeof Card, public result: typeof Card) {}

  leftCardCurrent: Card;
  rightCardCurrent: Card;

  craft() {
    questFlags.hasCrafted = true;
    if (this.result !== undefined) {
      AudioControl.craft.play();
      this.crafted = new this.result({ x: 0, y: 0 });
      this.crafted.owner = this;
      this.crafted.performEffect();
    }
  }

  removeCard(card: Card) {
    if (card === this.crafted) {
      this.crafted = null;
    }
  }

  canAccept(card: Card) {
    if (this.crafted) {
      return false;
    }

    const cardType = getClassFromCard(card);

    if (this.leftCard === cardType && !this.leftCardCurrent) {
      return true;
    }
    if (this.rightCard === cardType && !this.rightCardCurrent) {
      return true;
    }
    return false;
  }
  addIngredient(card: Card) {
    const cardType = getClassFromCard(card);
    if (this.leftCard === cardType && !this.leftCardCurrent) {
      this.leftCardCurrent = card;
      this.leftCardCurrent.position = { x: 0, y: 0 };
      AudioControl.hit_table.play();
      card.remove();
    } else if (this.rightCard === cardType && !this.rightCardCurrent) {
      this.rightCardCurrent = card;
      this.rightCardCurrent.position = { x: 0, y: 0 };
      AudioControl.hit_table.play();
      card.remove();
    }
    forceUpdate();

    if (this.leftCardCurrent && this.rightCardCurrent) {
      if (this.leftConsumed) {
        this.leftCardCurrent.destroying = true;
        setTimeout(() => {
          this.leftCardCurrent = null;
          forceUpdate();
        }, 500);
      }
      if (this.rightConsumed) {
        this.rightCardCurrent.destroying = true;
        setTimeout(() => {
          this.rightCardCurrent = null;
          forceUpdate();
        }, 500);
      }
      this.craft();
    }
  }
}
