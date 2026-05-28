<template>
  <div ref="game"/>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Matter from "matter-js";

definePageMeta({ ssr: false, middleware: [] });

const { Engine, Render, Runner, Bodies, World, Composite } = Matter;

type FruitType = {
  img: string;
  radius: number;
  scaleFactor: number;
  selectionProbability: number;
};

const fruitTypes: Record<string, FruitType> = {
  cherry:     { img: '/img/cherry.png',     radius: 40, scaleFactor: 0.40, selectionProbability: 1},
  strawberry: { img: '/img/strawberry.png', radius: 36, scaleFactor: 0.36, selectionProbability: 0 },
  grapes:     { img: '/img/grape.png',      radius: 32, scaleFactor: 0.32, selectionProbability: 0 },
  citrus:     { img: '/img/citrus.png',     radius: 28, scaleFactor: 0.28, selectionProbability: 0 },
  apple:      { img: '/img/apple.png',      radius: 24, scaleFactor: 0.24, selectionProbability: 0 },
  pear:       { img: '/img/pear.png',       radius: 20, scaleFactor: 0.20, selectionProbability: 0},
  peach:      { img: '/img/peach.png',      radius: 17, scaleFactor: 0.17, selectionProbability: 0},
  pineapple:  { img: '/img/pineapple.png',  radius: 13, scaleFactor: 0.13, selectionProbability: 0},
  melon:      { img: '/img/melon.png',      radius: 9,  scaleFactor: 0.09, selectionProbability: 0},
  watermelon: { img: '/img/watermelon.png', radius: 5,  scaleFactor: 0.05, selectionProbability: 0},
};

const game = ref<HTMLElement | null>(null);

let engine: Matter.Engine;
let render: Matter.Render;
let runner: Matter.Runner;
let currentFruit: Matter.Body | null = null;
let spawnInterval: ReturnType<typeof setInterval>;

function selectRandomFruit(): FruitType | undefined {
  const random = Math.random();
  let sum = 0;
  for (const fruit of Object.values(fruitTypes)) {
    sum += fruit.selectionProbability;
    if (random < sum) return fruit;
  }
}

async function preloadAllFruits() {
  await Promise.all(
    Object.values(fruitTypes).map(
      (fruit) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve();
            console.log(`${fruit.img}: ${img.naturalWidth}x${img.naturalHeight} → scaleFactor: ${fruit.scaleFactor}`);
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = fruit.img;
        })
    )
  );
}
selectRandomFruit()
function createNewFallingFruit() {
  const type = selectRandomFruit();
  const fruit = Bodies.circle(380, 140, type.radius, {
    restitution: 0.5,
    render: {
      sprite: {
        texture: type.img,
        xScale: type.scaleFactor,
        yScale: type.scaleFactor,
      },
    },
  });
  fruit.label = type.img.slice(5, -4) 
  //should i have to resort to this convoluted method for getting fruit name?
  // no but i structured the data weirdly :sob

  Composite.add(engine.world, fruit);
  return fruit;
}

onMounted(async () => {
  if (!game.value) return;

  engine = Engine.create();

  await preloadAllFruits();
  render = Render.create({
    element: game.value,
    engine,
    options: {
      width: 800,
      height: 900,
      wireframes: false,
    },
  });

  const ground      = Bodies.rectangle(400, 800, 810, 40,  { isStatic: true });
  const leftWall    = Bodies.rectangle(10,  200, 20,  1160, { isStatic: true });
  const rightWall   = Bodies.rectangle(785, 200, 20,  1160, { isStatic: true });
  const containerTop = Bodies.rectangle(397, 70,  755, 20, {
    isStatic: true,
    isSensor: true,
    render: { fillStyle: 'red', opacity: 0.3 },
  });

  World.add(engine.world, [ground, leftWall, rightWall, containerTop]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!currentFruit) return;
    const speed = 3;
    if (e.key === 'ArrowLeft')  Matter.Body.setVelocity(currentFruit, { x: -speed, y: currentFruit.velocity.y });
    if (e.key === 'ArrowRight') Matter.Body.setVelocity(currentFruit, { x:  speed, y: currentFruit.velocity.y });
  };
  document.addEventListener('keydown', handleKeyDown);

  Matter.Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
      const labels = [pair.bodyA.label, pair.bodyB.label];
      if (labels.includes('Circle Body') && labels.includes('Rectangle Body')) {
      } else if (pair.bodyA.label === pair.bodyB.label) {
        console.log('fuse')
        const firstBodyToRemove = Matter.Composite.allBodies(engine.world).find(body => body.id === pair.bodyA.id);
        const secondBodyToRemove = Matter.Composite.allBodies(engine.world).find(body => body.id === pair.bodyB.id);
        console.log(pair.bodyB.id)
        console.log(secondBodyToRemove, firstBodyToRemove)
        if (firstBodyToRemove || secondBodyToRemove) {
          Matter.Composite.remove(engine.world, firstBodyToRemove);
          Matter.Composite.remove(engine.world, secondBodyToRemove)
        }
      }
    });
  });

  spawnInterval = setInterval(() => {
    currentFruit = createNewFallingFruit();
  }, 2000);

  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
});

onBeforeUnmount(() => {
  clearInterval(spawnInterval);
  if (render) Render.stop(render);
  if (runner) Runner.stop(runner);
  if (engine) Engine.clear(engine);
  render?.canvas?.remove();
});
</script>