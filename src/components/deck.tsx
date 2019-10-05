import { Deck, getClassFromDeck } from "../models/deck";
import React, { useState, CSSProperties, useRef, useContext } from "react";
import { cardWidth, cardHeight, CardComponent } from "./card";

import "./deck.css";
import { cards } from "../state";
import { StateUpdateContext } from "..";

interface DeckProps {
  deck: Deck;
}

const renderDeckCard = (deck: Deck, index: number, flipped?: boolean)  => {
  const inverseIndex = deck.cards.length - index;
  const deckType = getClassFromDeck(deck);

  const style: CSSProperties ={
    transform: `translate(${inverseIndex * 0.1}em, ${-inverseIndex * 0.1}em)`
  };
  

  let className = "deckCard";
  if(flipped) {
    className += " flip";
  }

  return <div className={className} key={index} style={style}>
    <img src={deckType.artUrl} width={cardWidth} height={cardHeight} />

    <span className="title">{deckType.displayName}</span>
  </div>;
}

export const DeckComponent = (props: DeckProps) => {
  const {deck} = props;

  const [isFlipping, setFlipping] = useState(false);
  

  const style = {
    left: `${deck.position.x}rem`,
    top: `${deck.position.y}rem`,
  };


  let topCard = null;
  const bottomDeckCards = [];
  if(deck.cards.length > 1) {
    for(let i = deck.cards.length; i > 0; i--) {
      bottomDeckCards.push(renderDeckCard(deck, i));
    }
    topCard = renderDeckCard(deck, 0, isFlipping);
  }
  else if(deck.cards.length === 1) {
    topCard = <>
      <div className={"empty"}>{renderDeckCard(deck, 0)}</div>
      {renderDeckCard(deck, 0, isFlipping)}
    </>;
  }
  else if(deck.cards.length === 0) {
    topCard = <div className={"empty"}>{renderDeckCard(deck, 0)}</div>;
  }
  if(isFlipping) {
    topCard = <>
      {topCard}
      {<CardComponent card={deck.cards[0]} flip={true} transformOverride={`translate(${deck.cards.length * 0.1}em, ${-deck.cards.length * 0.1}em) rotateY(180deg)`} />}
    </>
  }

  const forceUpdate = useContext(StateUpdateContext);

  const onClick = () => {
    if(!isFlipping && deck.cards.length > 0) {
      setFlipping(true);
      setTimeout(() => {
        const card = deck.cards.pop();
        card.position = {x: deck.position.x - 8.25, y: deck.position.y};
        cards.push(card);
        setFlipping(false);
        forceUpdate();
      }, 500);
    }
  }


  return <div className={"deck"} style={style} onClick={onClick}>
    {bottomDeckCards}
    {topCard}
  </div>;
}