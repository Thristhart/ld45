import { Deck, getClassFromDeck } from "../models/deck";
import React, { useState, CSSProperties, useRef, useContext } from "react";
import { cardWidth, cardHeight, CardComponent } from "./card";

import "./deck.css";
import { cards } from "../state";
import { Card } from "../models/card";
import { Discard } from "./discard";
import { Quest } from "../decks/quests";
import { AudioControl } from "../audio";
import shuffle from "shuffle-array";

interface DeckProps {
  deck: Deck;
}

const renderDeckCard = (deck: Deck, index: number, flipped?: boolean, reverseFlip?: boolean) => {
  const inverseIndex = deck.cards.length - index;
  const deckType = getClassFromDeck(deck);

  const style: CSSProperties = {
    transform: `translate(${inverseIndex * 0.1}em, ${-inverseIndex * 0.1}em)`,
  };

  let className = "deckCard";
  if (flipped) {
    className += " flip";
  }
  if (reverseFlip) {
    className += " reverseFlip";
  }

  return (
    <div className={className} key={index} style={style}>
      <img src={deckType.artUrl} width={cardWidth} height={cardHeight} />

      <span className="title">{deckType.displayName}</span>
    </div>
  );
};

export const DeckComponent = (props: DeckProps) => {
  const { deck } = props;

  const [isFlipping, setFlipping] = useState(false);
  const [isShuffling, setShuffling] = useState(false);

  const style = {
    left: `${deck.position.x}rem`,
    top: `${deck.position.y}rem`,
  };

  let topCard = null;
  const bottomDeckCards = [];
  if (deck.cards.length > 1) {
    for (let i = deck.cards.length; i > 0; i--) {
      bottomDeckCards.push(renderDeckCard(deck, i));
    }
    topCard = renderDeckCard(deck, 0, isFlipping);
  } else if (deck.cards.length === 1) {
    topCard = (
      <>
        <div className={"empty"}>{renderDeckCard(deck, 0)}</div>
        {renderDeckCard(deck, 0, isFlipping)}
      </>
    );
  } else if (deck.cards.length === 0) {
    topCard = <div className={"empty"}>{renderDeckCard(deck, 0)}</div>;
  }
  if (isFlipping) {
    topCard = (
      <>
        {topCard}
        {
          <CardComponent
            card={deck.cards[deck.cards.length - 1]}
            flip={true}
            transformOverride={`translate(${deck.cards.length * 0.1}em, ${-deck.cards.length * 0.1}em) rotateY(180deg)`}
            transformOffset={{ x: `${deck.discard.length * 0.1}em`, y: `${-deck.discard.length * 0.1}em` }}
          />
        }
      </>
    );
  }

  const onClick = () => {
    draw();
  };

  const draw = () => {
    if (!isFlipping && !isShuffling) {
      if (deck.cards.length > 0) {
        drawAnimation().then((card) => {
          drawEffect(card);
        });
      } else {
        // can't shuffle decks
        if (deck instanceof Quest) {
          return;
        }
        AudioControl.shuffle.play();
        setShuffling(true);
        setTimeout(() => {
          deck.cards = shuffle(deck.discard);
          deck.discard = [];
          setShuffling(false);
        }, 500);
      }
    }
  };

  const drawAnimation = () => {
    AudioControl.draw.play();
    setFlipping(true);
    return new Promise<Card>((resolve) =>
      setTimeout(() => {
        const card = deck.cards.pop();
        card.position = { x: deck.position.x - 132, y: deck.position.y };
        AudioControl.hit_table.play();
        setFlipping(false);
        resolve(card);
      }, 500)
    );
  };

  const drawEffect = (card: Card) => {
    deck.discard.push(card);
    card.performEffect();
  };

  return (
    <>
      <Discard deck={deck} shuffle={isShuffling} />
      <div className={"deck"} style={style} onClick={onClick}>
        {isShuffling && renderDeckCard(deck, 0, true, true)}
        {bottomDeckCards}
        {topCard}
      </div>
    </>
  );
};
