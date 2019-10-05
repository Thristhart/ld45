import { Card } from "../../models/card";
import { decks, cards } from "../../state";

export class Rock extends Card {
  static displayName = "Rock";
  static artUrl = "./assets/cards/rock.jpg";
}
