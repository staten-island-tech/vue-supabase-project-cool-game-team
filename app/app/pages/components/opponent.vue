<template>
  <div
    :style="{ width: scale * 800 + 'px', height: scale * 900 + 'px' }"
    class="overflow-hidden relative"
  >
    <div
      :style="{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'absolute'
      }"
      ref="game"
    />

    <div
      v-if="state"
      :style="{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'absolute',
        top: 0,
        right: 0
      }"
    >
      <div class="text-white text-4xl font-extrabold m-2">
        Time Survived: {{ state.timeSurvived }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Matter from "matter-js";
import { useMatchStore } from "~/stores/match";
import {createFruit} from "~/utils/physics"
const props = defineProps<{
  state: any;
}>();
///to do: take user movement into account, add merge 

const matchStore = useMatchStore();
const scale = matchStore.scale;

const game = ref<HTMLElement | null>(null);

const { Engine, Render, Runner, Bodies, World, Composite } = Matter;

let engine: Matter.Engine;
let render: Matter.Render;
let runner: Matter.Runner;

watch(
  () => props.state,
  (newState) => {
    if (!newState || !engine) return;

    createFruit(
      newState.formattedCurrentFruit.x,
      newState.formattedCurrentFruit.y,
      engine,
      newState.formattedCurrentFruit.label
    )
  },
  { deep: true }
);

onMounted(() => {
  if (!game.value) return;

  engine = Engine.create();

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
        //merge fruit code
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
          if (nextFruit) {
            requestAnimationFrame(() => {
              console.log(nextFruit)
              //createFruit(newFruitX, newFruitY, engine, nextFruit[1]);
            });
          }
        }
      }
    });
  })

  Render.run(render);
  
  runner = Runner.create();
  Runner.run(runner, engine);
});

onBeforeUnmount(() => {
  if (render) Render.stop(render);
  if (runner) Runner.stop(runner);
  if (engine) Engine.clear(engine);

  render?.canvas?.remove();
});
</script>