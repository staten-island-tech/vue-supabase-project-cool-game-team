<template>
  <div ref="canvasContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import Matter from "matter-js";

definePageMeta({ ssr: false });

const { Engine, Render, Runner, Bodies, World } = Matter;

export default defineComponent({
  setup() {
    const canvasContainer = ref<HTMLElement | null>(null);

    let engine: Matter.Engine;
    let render: Matter.Render;
    let runner: Matter.Runner;

    onMounted(() => {
      if (!canvasContainer.value) return;

      // 1. Create engine
      engine = Engine.create();

      // 2. Create renderer — attach to your ref'd div, not document.body
      render = Render.create({
        element: canvasContainer.value,
        engine: engine,
        options: {
          width: 800,
          height: 600,
          wireframes: false,
        },
      });

      // 3. Create bodies, filler assets rn, will replace later
      const boxA = Bodies.rectangle(400, 200, 80, 80);
      const ballA = Bodies.circle(380, 100, 40, { restitution: 0.5 });
      const ground = Bodies.rectangle(400, 580, 810, 40, { isStatic: true });

      // 4. Add to world
      World.add(engine.world, [boxA, ballA, ground]);
      // 5. Event listener

      type keys = {
        keytype: Boolean
      } //def broken
      const keys = {};
      Matter.Events.on(engine, 'beforeUpdate', function() {
          const speed = 5;
          let vx = 0;
          let vy = 0;

          if (keys['ArrowLeft']) vx = -speed;
          if (keys['ArrowRight']) vx = speed;
          // Use setVelocity for crisp movement
          Matter.Body.setVelocity(ballA, { x: vx, y: vy });
      });
      // 6. Run
      Render.run(render);
      runner = Runner.create();
      Runner.run(runner, engine);
    });

    onBeforeUnmount(() => {
      // Clean up to avoid memory leaks on route change
      if (render) Render.stop(render);
      if (runner) Runner.stop(runner);
      if (engine) Engine.clear(engine);
      render?.canvas?.remove();
    });

    return { canvasContainer };
  },
});
</script>
