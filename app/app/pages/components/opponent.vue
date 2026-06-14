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

function createFruit(
  id: number,
  x: number,
  y: number,
  label: string
) {
  const fruitType = matchStore.fruitTypes[label];

  if (!fruitType) return;

  const fruit = Bodies.circle(
    x,
    y,
    fruitType.radius,
    {
      render: {
        sprite: {
          texture: fruitType.img,
          xScale: fruitType.scaleFactor,
          yScale: fruitType.scaleFactor,
        },
      },
    }
  );

  fruit.label = label;

  Composite.add(engine.world, fruit);
}

watch(
  () => props.state,
  (newState) => {
    if (!newState || !engine) return;

    createFruit(
      newState.formattedCurrentFruit.id,
      newState.formattedCurrentFruit.x,
      newState.formattedCurrentFruit.y,
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