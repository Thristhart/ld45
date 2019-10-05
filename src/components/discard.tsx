import { Deck } from "../models/deck";
import { CardComponent } from "./card";
import React, { CSSProperties } from "react";
import { Card } from "../models/card";
import "./discard.css";

interface DiscardProps {
  deck: Deck;
  shuffle: boolean;
}

const renderStackCard = (card: Card, deck: Deck, index: number) => {
  const style: CSSProperties = {
    transform: `translate(${index * 0.1}em, ${-index * 0.1}em) skew(3deg)`,
  };

  return <CardComponent card={card} disableDrag={true} deck={deck} key={index} style={style} />;
};

export const Discard = (props: DiscardProps) => {
  const deck = props.deck;
  const discard = deck.discard;
  if (discard.length === 0) {
    return null;
  }
  const stack = discard.map((card, index) => renderStackCard(card, deck, index));
  const style = {
    left: `${deck.position.x - 132}rem`,
    top: `${deck.position.y}rem`,
  };
  let className = "discard";
  if (props.shuffle) {
    className += " shuffle";
  }
  return (
    <div className={className} style={style}>
      {stack}
    </div>
  );
};
