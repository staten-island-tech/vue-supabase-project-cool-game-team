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
  scaleFactor?: number;
  selectionProbability: number;
};

const fruitTypes: Record<string, FruitType> = {
  cherry:     { img: '/img/cherry.png',     radius: 170, selectionProbability: 1 },
  strawberry: { img: '/img/strawberry.png', radius: 145, selectionProbability: 0 },
  grape:      { img: '/img/grape.png',      radius: 120, selectionProbability: 0 },
  citrus:     { img: '/img/citrus.png',     radius: 100, selectionProbability: 0 },
  apple:      { img: '/img/apple.png',      radius: 85,  selectionProbability: 0 },
  pear:       { img: '/img/pear.png',       radius: 70,  selectionProbability: 0 },
  peach:      { img: '/img/peach.png',      radius: 55,  selectionProbability: 0 },
  pineapple:  { img: '/img/pineapple.png',  radius: 40,  selectionProbability: 0 },
  melon:      { img: '/img/melon.png',      radius: 30,  selectionProbability: 0 },
  watermelon: { img: '/img/watermelon.png', radius: 20,  selectionProbability: 0 },
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
            fruit.scaleFactor = (fruit.radius * 2) / img.naturalWidth;
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
function createNewFruit(x = 380, y = 140, type = selectRandomFruit()) {
  //default falling x = 380, y = 140
  const fruit = Bodies.circle(x, y, type.radius, {
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
  // no but i structured the data weirdly :sob:
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
    label: 'lose'
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
      const fruitLabels = Object.keys(fruitTypes)

      if (labels.includes('Circle Body') && labels.some(l => fruitLabels.includes(l))) {
        navigateTo('/lose')
        console.log('lose')
      } else if (pair.bodyA.label === pair.bodyB.label) {
        const firstBodyToRemove = Matter.Composite.allBodies(engine.world).find(body => body.id === pair.bodyA.id);
        const secondBodyToRemove = Matter.Composite.allBodies(engine.world).find(body => body.id === pair.bodyB.id);
        if (firstBodyToRemove || secondBodyToRemove) {
          const fruitTypesArray = Object.entries(fruitTypes);
          const index = fruitTypesArray.findIndex(([name]) => name === pair.bodyA.label);
          const nextFruit = fruitTypesArray[index + 1]; 
            
          const newFruitX = (firstBodyToRemove?.position.x + secondBodyToRemove?.position.x)/2
          const newFruitY = (firstBodyToRemove?.position.y + secondBodyToRemove?.position.y)/2
          createNewFruit(newFruitX, newFruitY, nextFruit[1])
          Matter.Composite.remove(engine.world, firstBodyToRemove);
          Matter.Composite.remove(engine.world, secondBodyToRemove)
        }
        
      }
    });
  });

  spawnInterval = setInterval(() => {
    currentFruit = createNewFruit();
  }, 200);

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