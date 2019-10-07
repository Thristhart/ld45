import { Card } from "../models/card";
import React, { CSSProperties } from "react";
import { CardComponent } from "./card";
import "./stack.css";

interface StackProps {
  stack: Card[];
}

const renderStackCard = (card: Card, index: number, draggable: boolean) => {
  const style: CSSProperties = {
    transform: `translate(${index * 0.1}em, ${-index * 0.1}em) skew(3deg)`,
    top: 0,
    left: 0,
  };

  return <CardComponent card={card} disableDrag={!draggable} key={index} style={style} />;
};

export const Stack = (props: StackProps) => {
  const stack = props.stack;
  if (stack.length === 0) {
    return null;
  }
  const last10 = stack.slice(-10);

  const pile = last10.map((card, index) => renderStackCard(card, index, index === last10.length - 1));
  const style = {
    left: `${stack[0].position.x}rem`,
    top: `${stack[0].position.y}rem`,
  };
  let className = "stack";
  return (
    <div className={className} style={style}>
      {pile}
      <span className="count">{stack.length}</span>
    </div>
  );
};
