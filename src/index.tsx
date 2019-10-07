import React, { useState, useCallback, CSSProperties } from "react";
import ReactDOM from "react-dom";
import { AudioControl } from "./audio";
import { cards, decks, miscState, recipes, gameProgress, stacks } from "./state";
import { CardComponent } from "./components/card";

import "./index.css";
import { Quest } from "./decks/quests";
import { DeckComponent } from "./components/deck";
import { loadCards } from "./preloadCards";
import { RecipeComponent } from "./components/recipe";
import { getClassFromCard, Card } from "./models/card";
import { Golem } from "./cards/upgrades/golem";
import { Rock } from "./cards/resources/rock";
import { Stack } from "./components/stack";

let questDeck = new Quest({ x: 0, y: 0 });
decks.push(questDeck);

setInterval(() => {
  for (let card of questDeck.discard) {
    const cardType = getClassFromCard(card);
    if ((cardType.requirements && cardType.requirements.validate(card)) || !cardType.requirements) {
      if (cardType.effect.needsFeedback && !card.waitingForFeedback) {
        card.waitingForFeedback = true;
        AudioControl.quest_complete.play();
        forceUpdate();
      }
    }
  }
}, 200);

const originalRemoveChild = Node.prototype.removeChild;
// @ts-ignore
Node.prototype.removeChild = function() {
  try {
    originalRemoveChild.apply(this, arguments);
  } catch (e) {
    console.log("I have commited a horrible sin against javascript");
  }
};

export let forceUpdate: () => void;
export let setCardPreview: (foo: any, id: string) => void;

let isMovingCamera = false;

export const dropCard = (card: Card, retry?: boolean) => {
  let bounding;
  if (card.div) {
    bounding = card.div.getBoundingClientRect();
  } else {
    // this is terrible
    forceUpdate();
    if (!retry) {
      setTimeout(() => {
        dropCard(card, true);
      }, 16);
      return;
    }
    bounding = card.div.getBoundingClientRect();
  }
  const hitStack = stacks.find((stack) => {
    const stackBounds = stack[0].div.getBoundingClientRect();
    return (
      stackBounds.left < bounding.left + bounding.width &&
      stackBounds.left + stackBounds.width > bounding.left &&
      stackBounds.top < bounding.top + bounding.height &&
      stackBounds.top + stackBounds.height > bounding.top
    );
  });
  if (hitStack) {
    if (!hitStack.includes(card)) {
      card.remove();
      hitStack.push(card);
      card.owner = hitStack;
    }
    forceUpdate();
    return;
  }
  const hitCard = cards.find((otherCard) => {
    if (card === otherCard) return false;
    const cardBounds = otherCard.div.getBoundingClientRect();
    return (
      cardBounds.left < bounding.left + bounding.width &&
      cardBounds.left + cardBounds.width > bounding.left &&
      cardBounds.top < bounding.top + bounding.height &&
      cardBounds.top + cardBounds.height > bounding.top
    );
  });
  if (hitCard) {
    hitCard.remove();
    card.remove();
    const newStack = [hitCard, card];
    card.owner = newStack;
    hitCard.owner = newStack;
    stacks.push(newStack);
    forceUpdate();
    return;
  }
};

const onMouseUp = () => {
  if (isMovingCamera) {
    isMovingCamera = false;
    document.body.style.cursor = "initial";
  }
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div: HTMLElement = card.div;

    const bounding = div.getBoundingClientRect();

    if (document.getElementById("ui").contains(div)) {
      card.position = {
        x: -(window.innerWidth / 2) + 64.5 + bounding.left - miscState.cameraPos.x - 3.5,
        y: -(window.innerHeight / 2) + 85.875 + bounding.top - miscState.cameraPos.y - 8,
      };
      div.style.transform = `skew(3deg)`;
      const hitRecipe = recipes.find((recipe) => {
        const recipeBounds = recipe.element.getBoundingClientRect();
        return (
          recipeBounds.left < bounding.left + bounding.width &&
          recipeBounds.left + recipeBounds.width > bounding.left &&
          recipeBounds.top < bounding.top + bounding.height &&
          recipeBounds.top + recipeBounds.height > bounding.top &&
          recipe.canAccept(card)
        );
      });
      if (!stacks.includes(miscState.draggedCard.owner)) {
        document.getElementById("field").appendChild(div);
      }
      if (hitRecipe) {
        hitRecipe.addIngredient(card);
        div.parentElement.removeChild(div);
      } else {
        card.position = { ...miscState.dragStartPos };
        div.style.left = card.position.x + "rem";
        div.style.top = card.position.y + "rem";
        AudioControl.craft_fail.play();
        if (stacks.includes(miscState.draggedCard.owner)) {
          miscState.draggedCard.remove();
          cards.push(miscState.draggedCard);
        }
      }
      miscState.draggedCard.div.classList.remove("dragging");
      miscState.dragTransform = { x: 0, y: 0 };
      miscState.draggedCard = null;
      forceUpdate();
      return; //ugh
    } else {
      card.position = {
        x: card.position.x + miscState.dragTransform.x,
        y: card.position.y + miscState.dragTransform.y,
      };

      div.style.transform = `skew(3deg)`;
      forceUpdate();
      AudioControl.hit_table.play();
    }

    if (miscState.draggedCard instanceof Golem) {
      const golem = miscState.draggedCard;
      const golemCenter = {
        x: golem.position.x + 64.5,
        y: golem.position.y + 85.875,
      };

      const nearbyDeck = decks.find((deck) => {
        const center = {
          x: deck.position.x + 64.5,
          y: deck.position.y + 85.875,
        };

        const xDiff = golemCenter.x - center.x;
        const yDiff = golemCenter.y - center.y;

        const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        return distance < 220;
      });
      if (nearbyDeck) {
        const existingGolem = cards.find((card) => card instanceof Golem && card.owner === nearbyDeck) as Golem;
        if (existingGolem) {
          existingGolem.owner = null;
          existingGolem.wasPlayed = false;
          existingGolem.animateTo({ x: nearbyDeck.position.x - 129, y: nearbyDeck.position.y + 350 });
          clearInterval(existingGolem.interval);
        }
        golem.owner = nearbyDeck;
        golem.wasPlayed = true;
        golem.animateTo({ x: nearbyDeck.position.x + 8, y: nearbyDeck.position.y + 200 });
        golem.interval = setInterval(() => {
          let rockToEat = cards.find((card) => card instanceof Rock);
          if (!rockToEat) {
            const rockToEatStack = stacks.find((stack) => stack.find((card) => card instanceof Rock));
            if (rockToEatStack) {
              rockToEat = rockToEatStack.find((card) => card instanceof Rock);
            }
          }
          if (rockToEat) {
            rockToEat.destroying = true;
            forceUpdate();
            setTimeout(() => {
              rockToEat.remove();
            }, 500);

            const didDraw = golem.owner.draw();
            AudioControl.golem.play();
            if (didDraw) {
              golem.animateTo({ x: golem.owner.position.x - 129, y: nearbyDeck.position.y + 200 });

              setTimeout(() => {
                golem.animateTo({ x: nearbyDeck.position.x + 8, y: nearbyDeck.position.y + 200 });
              }, 500);
            }
          }
        }, golem.cooldown);
      }
    } else {
      // use an IIFE to allow me to return out of the logic
      (() => {
        const hitStack = stacks.find((stack) => {
          const stackBounds = stack[0].div.getBoundingClientRect();
          return (
            stackBounds.left < bounding.left + bounding.width &&
            stackBounds.left + stackBounds.width > bounding.left &&
            stackBounds.top < bounding.top + bounding.height &&
            stackBounds.top + stackBounds.height > bounding.top
          );
        });
        if (hitStack) {
          if (!hitStack.includes(miscState.draggedCard)) {
            miscState.draggedCard.remove();
            hitStack.push(miscState.draggedCard);
            miscState.draggedCard.owner = hitStack;
          }
          forceUpdate();
          return;
        }
        const hitCard = cards.find((card) => {
          if (card === miscState.draggedCard || card instanceof Golem) return false;
          const cardBounds = card.div.getBoundingClientRect();
          return (
            cardBounds.left < bounding.left + bounding.width &&
            cardBounds.left + cardBounds.width > bounding.left &&
            cardBounds.top < bounding.top + bounding.height &&
            cardBounds.top + cardBounds.height > bounding.top
          );
        });
        if (hitCard) {
          hitCard.remove();
          miscState.draggedCard.remove();
          const newStack = [hitCard, miscState.draggedCard];
          miscState.draggedCard.owner = newStack;
          hitCard.owner = newStack;
          stacks.push(newStack);
          forceUpdate();
          return;
        }

        if (stacks.includes(miscState.draggedCard.owner)) {
          miscState.draggedCard.remove();
          cards.push(miscState.draggedCard);
        }
      })();
    }
    miscState.draggedCard.div.classList.remove("dragging");
    miscState.dragTransform = { x: 0, y: 0 };
    miscState.draggedCard = null;
  }
};
const onMouseMove = (e) => {
  if (e.target.id === "container" && !isMovingCamera) {
    document.body.style.cursor = "grab";
  } else if (!isMovingCamera) {
    document.body.style.cursor = "initial";
  }
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div = card.div;

    let transform = { x: miscState.dragTransform.x + e.movementX, y: miscState.dragTransform.y + e.movementY };
    miscState.dragTransform = transform;

    const transformString = `translate(${transform.x}rem, ${transform.y}rem) skew(3deg)`;
    div.style.transform = transformString;
  } else if (isMovingCamera) {
    miscState.cameraPos = {
      x: miscState.cameraPos.x + e.movementX,
      y: miscState.cameraPos.y + e.movementY,
    };

    document.documentElement.style.setProperty("--cameraX", miscState.cameraPos.x + "rem");
    document.documentElement.style.setProperty("--cameraY", miscState.cameraPos.y + "rem");
  }
};

const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const target = event.target as HTMLElement;
  if (target.id === "container") {
    document.body.style.cursor = "grabbing";
    isMovingCamera = true;
  }
};

const onMouseEnterUi = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  if (miscState.draggedCard != null) {
    let card = miscState.draggedCard;
    let div: HTMLElement = card.div;

    const ui = document.getElementById("ui");

    if (!ui.contains(div)) {
      const bounding = div.getBoundingClientRect();
      div.style.top = bounding.top + "rem";
      div.style.left = bounding.left + "rem";
      miscState.dragTransform = { x: 0, y: 0 };
      ui.appendChild(div);
    }

    let transform = { x: miscState.dragTransform.x + e.movementX, y: miscState.dragTransform.y + e.movementY };
    miscState.dragTransform = transform;

    const transformString = `translate(${transform.x}rem, ${transform.y}rem) skew(3deg)`;
    div.style.transform = transformString;
  }
};

const onMouseExitUi = () => {};

let lastPreviewId = "";

let loaded = false;
const load = async () => {
  const loaders = [AudioControl.loadedAudio, loadCards()];

  await Promise.all(loaders);

  loaded = true;

  forceUpdate();
};

load();

const App = () => {
  const [_, stateHack] = useState();
  const [preview, setPreview] = useState(null);

  forceUpdate = useCallback(() => stateHack({}), []);
  setCardPreview = useCallback((preview: any, id: string) => {
    if (preview && lastPreviewId !== id) {
      AudioControl.hover.play();
    }
    if (preview) {
      lastPreviewId = id;
    }
    if (lastPreviewId === id) {
      if (miscState.draggedCard) {
        if (!preview) {
          setPreview(preview);
        }
      } else {
        setPreview(preview);
      }
    }
  }, []);

  if (!loaded) {
    return <div style={{ fontSize: "64em" }}>Loading...</div>;
  }

  const caveProgress = gameProgress.caveExploration / 8;

  let caveStyle: CSSProperties = {
    maskPosition: `${(1 - caveProgress) * -816}rem`,
    WebkitMaskPositionX: `${(1 - caveProgress) * -816}rem`,
  };

  if (caveProgress >= 1) {
    caveStyle = {};
  }

  return (
    <>
      <div id="container" onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseDown={onMouseDown}>
        <section id="field">
          {decks.map((deck) => (
            <DeckComponent deck={deck} key={deck.id} />
          ))}
          {cards.map((card) => (
            <CardComponent card={card} key={card.id} />
          ))}
          {stacks.map((stack, index) => (
            <Stack stack={stack} key={index} />
          ))}
          <div id="cavepath" style={caveStyle} className={caveProgress >= 1 ? "revealed" : ""}></div>
        </section>
        <section id="ui" onMouseEnter={onMouseEnterUi} onMouseLeave={onMouseExitUi}>
          <div id="recipes">
            {recipes.map((recipe) => (
              <RecipeComponent recipe={recipe} key={recipe.result.displayName} />
            ))}
          </div>
          {preview}
        </section>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
