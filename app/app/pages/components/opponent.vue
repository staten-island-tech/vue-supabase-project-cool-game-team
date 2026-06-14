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

const matchStore = useMatchStore();
const scale = matchStore.scale;

const game = ref<HTMLElement | null>(null);

const { Engine, Render, Runner, Bodies, Composite } = Matter;

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
      isStatic: true,
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

    Composite.clear(engine.world, false);

    newState.fruits.forEach((fruit: any) => {
      createFruit(
        fruit.id,
        fruit.x,
        fruit.y,
        fruit.label
      );
    });
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