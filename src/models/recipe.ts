import { Card } from "./card";

export class Recipe {
  leftConsumed: boolean = true;
  rightConsumed: boolean = true;

  constructor(public leftCard: typeof Card, public rightCard: typeof Card, public result: typeof Card) {}
}
