export class Card {
  static displayName: string;
  static artUrl: string;
  static effect?: Effect;
  static requirements?: Requirement;
  static recipe?: Card[];

  constructor(public position: {x: number, y: number}) {}
}

export function getClassFromCard(foo: Card) {
  return foo.constructor as typeof Card;
}


export interface Effect {
  callback: () => void;
  description: string;
}

export interface Requirement {
  validate: () => boolean;
  description: string;
}