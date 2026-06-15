import Matter from "matter-js";
import type { FruitType } from "./types";
const engine = Matter.Engine.create();

export function createFruit(x:number, y:number, engine: Matter.Engine, type: FruitType) {
  const fruit = Matter.Bodies.circle(x, y, type.radius, {
    restitution: 0.5,
    render: {
      sprite: {
        texture: type.img,
        xScale: type.scaleFactor!,
        yScale: type.scaleFactor!,
      },
    },
  });
  fruit.label = type.img.slice(5, -4);
  //should i have to resort to this convoluted method for getting fruit name?
  // no but i structured the data weirdly :sob:
  Matter.Composite.add(engine.world, fruit);
  return fruit;
}