import { Card, getClassFromCard } from "../models/card";
import React, { useState, useRef, Component, CSSProperties, useCallback } from "react";
import "./card.css";
import { debounce } from "debounce";
import { Deck } from "../models/deck";
import { forceUpdate, setCardPreview } from "..";
import { miscState } from "../state";
import { AudioControl } from "../audio";
import { Golem } from "../cards/upgrades/golem";

interface CardProps {
  card: Card;
  deck?: Deck;
  flip?: boolean;
  transformOverride?: string;
  transformOffset?: { x: string; y: string };
  disableDrag?: boolean;
  style?: CSSProperties;
}

export const cardWidth = 320;
export const cardHeight = 458;

const renderCardContents = (card: Card) => {
  const cardType = getClassFromCard(card);
  return (
    <>
      <img src={cardType.artUrl} width={cardWidth} height={cardHeight} />

      <span className="title">{cardType.displayName}</span>

      <div className="text">
        {cardType.requirements && (
          <p className="requirements">
            <b>Requirement</b>: <span className="requirementDescription">{cardType.requirements.description}</span>
          </p>
        )}
        {cardType.effect && cardType.effect.description !== "" && (
          <p className="effect">
            <b>Effect</b>: {cardType.effect.description}
          </p>
        )}
      </div>
    </>
  );
};

export const renderCardPreviewAtLocation = (card: Card, x: number, y: number) => {
  let className = "card preview";
  if (card.waitingForFeedback) {
    className += " waitingForFeedback";
  }
  if (card.wasPlayed) {
    className += " wasPlayed";
  }
  return (
    <div className={className} style={{ left: `${x}rem`, top: `${y}rem` }}>
      {renderCardContents(card)}
    </div>
  );
};

export const CardComponent = (props: CardProps) => {
  const { card, flip, deck, transformOverride, transformOffset, disableDrag, style } = props;

  const targetHoverPosition = useRef({ x: 0, y: 0 });
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    if (
      cardContainerRef.current &&
      !card.destroying &&
      !flip &&
      !(miscState.draggedCard && cardContainerRef.current === miscState.draggedCard.div)
    ) {
      const rect = cardContainerRef.current.getBoundingClientRect();
      targetHoverPosition.current = { x: rect.right + 8, y: rect.top + rect.height / 2 - cardHeight / 2 };
      if (targetHoverPosition.current.y < 0) {
        targetHoverPosition.current.y = 0;
      }
      if (targetHoverPosition.current.x < 0) {
        targetHoverPosition.current.x = 0;
      }
      if (targetHoverPosition.current.x + cardWidth > window.innerWidth) {
        targetHoverPosition.current.x = rect.left - cardWidth - 12;
      }
      if (targetHoverPosition.current.y + cardHeight > window.innerHeight) {
        targetHoverPosition.current.y = window.innerHeight - cardHeight - 12;
      }
      setCardPreview(
        renderCardPreviewAtLocation(card, targetHoverPosition.current.x, targetHoverPosition.current.y),
        card.id
      );
    }
    onMouseLeave.clear();
  };
  const onMouseLeave = useCallback(
    debounce(() => {
      setCardPreview(null, card.id);
    }, 200),
    []
  );
  const onMouseDown = (e) => {
    e.preventDefault();
    if (!disableDrag && !card.waitingForFeedback && !document.getElementById("ui").contains(cardContainerRef.current)) {
      miscState.draggedCard = card;
      card.div.classList.add("dragging");
      miscState.dragStartPos = { ...card.position };
      AudioControl.draw.play();
      if (card instanceof Golem) {
        clearInterval(card.interval);
      }
      setCardPreview(null, card.id);
    }
  };
  const onClick = () => {
    if (card.waitingForFeedback && !card.destroying) {
      card.play();
    }
  };

  const containerStyle: CSSProperties = {
    left: `${card.position.x}rem`,
    top: `${card.position.y}rem`,
    ...style,
  };

  if (cardContainerRef.current) {
    card.div = cardContainerRef.current;
  }

  let className = "card small";

  if (flip) {
    className += " flip";
    containerStyle.left = ""; // during flip anim we are inside the deck so our position should be 0 0
    containerStyle.top = "";
  }
  if (card.waitingForFeedback) {
    className += " waitingForFeedback";
  }
  if (card.wasPlayed) {
    className += " wasPlayed";
  }
  const destroyingTimer = useRef<NodeJS.Timeout>();
  if (card.destroying) {
    className += " destroying";
    if (!destroyingTimer.current) {
      setCardPreview(null, card.id);
      destroyingTimer.current = setTimeout(() => {
        if (deck) {
          deck.discard.splice(deck.discard.indexOf(card));
          forceUpdate();
        } else {
          card.remove();
        }
      }, 500);
    }
  }
  if (transformOverride) {
    containerStyle.transform = transformOverride;
  }
  if (transformOffset) {
    // @ts-ignore
    containerStyle["--animationXOffset"] = transformOffset.x;
    // @ts-ignore
    containerStyle["--animationYOffset"] = transformOffset.y;
  }
  if (deck) {
    containerStyle.left = ""; // let discard handle our position
    containerStyle.top = "";
  }
  return (
    <>
      <div
        ref={cardContainerRef}
        className={className}
        style={containerStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onClick={onClick}>
        {renderCardContents(card)}
      </div>
    </>
  );
};
