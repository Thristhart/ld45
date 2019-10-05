import { Card, getClassFromCard } from "../models/card";
import React, { useState, useRef, Component, CSSProperties } from "react";
import "./card.css";
import { debounce } from "debounce";

interface CardProps {
  card: Card;
  flip?: boolean;
  transformOverride?: string;
}

export const cardWidth = 320;
export const cardHeight = 458;

const renderCardContents = (card: Card) => {
  const cardType = getClassFromCard(card);
  return <>
    <img src={cardType.artUrl} width={cardWidth} height={cardHeight} />

    <span className="title">{cardType.displayName}</span>

    <div className="text">
      {cardType.requirements && <p className="requirements"><b>Requirement</b>: {cardType.requirements.description}</p>}
      {cardType.effect && <p className="effect"><b>Effect</b>: {cardType.effect.description}</p>}
    </div>
  </>;
}

export const renderCardPreviewAtLocation = (card: Card, x: number, y: number, onMouseEnter: () => void, onMouseLeave: () => void) => {
  return <div className={"card preview"} style={{left: `${x}px`, top: `${y}px` }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {renderCardContents(card)}
  </div>
}

export const CardComponent = (props: CardProps) => {
  const {card, flip, transformOverride} = props;

  const [hovering, setHovering] = useState(false);
  const targetHoverPosition = useRef({x: 0, y: 0});
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    if(cardContainerRef.current) {
      const rect = cardContainerRef.current.getBoundingClientRect();
      targetHoverPosition.current = {x: rect.right + 4, y: rect.top + rect.height / 2 - cardHeight / 2};
      if(targetHoverPosition.current.y < 0) {
        targetHoverPosition.current.y = 0;
      }
      if(targetHoverPosition.current.x < 0) {
        targetHoverPosition.current.x = 0;
      }
    }
    setHovering(true);
    onMouseLeave.clear();
  }
  const onMouseLeave = debounce(() => {
    setHovering(false);
  }, 200);

  const style: CSSProperties = {
    left: `${card.position.x}rem`,
    top: `${card.position.y}rem`,
  };

  let className = "card small";

  if(flip) {
    className += " flip"
    style.left = ""; // during flip anim we are inside the deck so our position should be 0 0
    style.top = "";
  }
  if(transformOverride) {
    style.transform = transformOverride;
  }

  return <>
    <div ref={cardContainerRef} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {renderCardContents(card)}
    </div>
    {hovering && renderCardPreviewAtLocation(card, targetHoverPosition.current.x, targetHoverPosition.current.y, onMouseEnter, onMouseLeave)}
  </>;
}