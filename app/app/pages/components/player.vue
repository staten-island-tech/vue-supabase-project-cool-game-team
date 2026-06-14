<template>
  <div :style="{ width: scale * 800 + 'px', height: scale * 900 + 'px' }" class="overflow-hidden relative">
    <div
      :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute' }"
      ref="game"
    />
    <div
      :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, right: 0 }"
    >
      <div class="text-white text-4xl font-extrabold m-2">
        Time Survived: {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Matter from "matter-js";

definePageMeta({ ssr: false, middleware: [] });
const emit = defineEmits(["gameData", 'leftTab']);
const { Engine, Render, Runner, Bodies, World, Composite } = Matter;

import { useMatchStore } from "~/stores/match";

const matchStore = useMatchStore();

const game = ref<HTMLElement | null>(null);

const scale = matchStore.scale;

let engine: Matter.Engine;
let render: Matter.Render;
let runner: Matter.Runner;
let currentFruit: Matter.Body | null = null;
let spawnIntervalChange: ReturnType<typeof setInterval>;

function selectRandomFruit(): FruitType | undefined {
  const random = Math.random();
  let sum = 0;
  for (const fruit of Object.values(matchStore.fruitTypes)) {
    sum += fruit.selectionProbability;
    if (random < sum) return fruit;
  }
}

async function preloadAllFruits() {
  await Promise.all(
    Object.values(matchStore.fruitTypes).map(
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
        }),
    ),
  );
}
selectRandomFruit();
function createNewFruit(x = 380, y = 250, type = selectRandomFruit()) {
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
  fruit.label = type.img.slice(5, -4);
  //should i have to resort to this convoluted method for getting fruit name?
  // no but i structured the data weirdly :sob:
  Composite.add(engine.world, fruit);
  return fruit;
}

const spawnStartInterval = 500; // ms
const spawnMinInterval = 500; // ms
const speedStepInterval = 10000; // decrease every 10s
const spawnDecreaseAmount = 100; // ms reduction per step
let handleKeyDown: ((e: KeyboardEvent) => void) | null = null
let spawnInterval = spawnStartInterval;
let timeSurvived = 0;
let formattedTime = ref("");

function formatTime(ms: number): string {
  const units = [
    { label: "day", ms: 86400000 },
    { label: "hour", ms: 3600000 },
    { label: "minute", ms: 60000 },
    { label: "second", ms: 1000 },
  ];

  let result = "";
  for (const unit of units) {
    const amount = Math.floor(ms / unit.ms);
    if (amount >= 1) {
      result += `${amount} ${unit.label}${amount !== 1 ? "s" : ""} `;
      ms -= amount * unit.ms;
    }
  }

  return result.trim();
}

function getCurrentSpawnInterval(): number {
  const steps = Math.floor(timeSurvived / speedStepInterval);
  const reduced = spawnStartInterval - steps * spawnDecreaseAmount;
  return Math.max(reduced, spawnMinInterval);
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

  const ground = Bodies.rectangle(400, 810, 810, 60, { isStatic: true });
  const leftWall = Bodies.rectangle(10, 200, 60, 1160, { isStatic: true });
  const rightWall = Bodies.rectangle(785, 200, 60, 1160, { isStatic: true });
  const containerTop = Bodies.rectangle(397, 70, 755, 20, {
    isStatic: true,
    isSensor: true,
    render: { fillStyle: "red", opacity: 0.3 },
    label: "lose",
  });

  World.add(engine.world, [ground, leftWall, rightWall, containerTop]);

  handleKeyDown = (e: KeyboardEvent) => {
    if (!currentFruit) return;
    const speed = 3;
    if (e.key === "ArrowLeft")
      Matter.Body.setVelocity(currentFruit, {
        x: -speed,
        y: currentFruit.velocity.y,
      });
    if (e.key === "ArrowRight")
      Matter.Body.setVelocity(currentFruit, {
        x: speed,
        y: currentFruit.velocity.y,
      });
  };
  document.addEventListener("keydown", handleKeyDown);

  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((pair) => {
      const labels = [pair.bodyA.label, pair.bodyB.label];
      const fruitLabels = Object.keys(matchStore.fruitTypes);
      if (
        labels.includes("lose") &&
        labels.some((l) => fruitLabels.includes(l))
      ) {
        //window.location.replace(`/lose?timeSurvived=${timeSurvived}`)
        //note: uncomment this out later
        //cant do the normal nuxt route page change because 
        //this is in matter.events.on
      } else if (pair.bodyA.label === pair.bodyB.label) {
        const firstBodyToRemove = Matter.Composite.allBodies(engine.world).find(
          (body) => body.id === pair.bodyA.id,
        );
        const secondBodyToRemove = Matter.Composite.allBodies(
          engine.world,
        ).find((body) => body.id === pair.bodyB.id);
        if (firstBodyToRemove && secondBodyToRemove) { 
          const fruitTypesArray = Object.entries(matchStore.fruitTypes);
          const index = fruitTypesArray.findIndex(
            ([name]) => name === pair.bodyA.label,
          );
          const nextFruit = fruitTypesArray[index + 1];

          const newFruitX =
            (firstBodyToRemove.position.x + secondBodyToRemove.position.x) / 2;
          const newFruitY =
            (firstBodyToRemove.position.y + secondBodyToRemove.position.y) / 2;

          Matter.Composite.remove(engine.world, firstBodyToRemove);
          Matter.Composite.remove(engine.world, secondBodyToRemove);

          if (nextFruit) createNewFruit(newFruitX, newFruitY, nextFruit[1]);
        }
      }
    });
  });

  spawnIntervalChange = setInterval(() => {
    spawnInterval = getCurrentSpawnInterval();
    currentFruit = createNewFruit();
    const fruits = Matter.Composite.allBodies(engine.world)
      .filter((b) => !b.isStatic && b.label !== "lose")
      .map((b) => ({
        id: b.id,
        x: b.position.x,
        y: b.position.y,
        label: b.label,
      }));
    emit("gameData", { fruits, timeSurvived: formattedTime.value });
  }, spawnInterval);
    

  setInterval(() => {
    timeSurvived += 1000;
    formattedTime.value = formatTime(timeSurvived);
  }, 1000);

  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);

  document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    //window.location.replace(`/lose?timeSurvived=${formattedTime.value}&reason=left`)
    //note: uncomment out later 
  }
})
});
onBeforeUnmount(() => {
    if (handleKeyDown) {
    document.removeEventListener("keydown", handleKeyDown)
  }
  });
  
onBeforeUnmount(() => {
  clearInterval(spawnIntervalChange);
  if (render) Render.stop(render);
  if (runner) Runner.stop(runner);
  if (engine) Engine.clear(engine);
  render?.canvas?.remove();
});
</script>
