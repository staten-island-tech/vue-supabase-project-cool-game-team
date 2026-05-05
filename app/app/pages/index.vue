<template>
  <div ref="game"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import Matter from "matter-js";

definePageMeta({ ssr: false });

const { Engine, Render, Runner, Bodies, World } = Matter;

export default defineComponent({
  setup() {
    const game = ref<HTMLElement | null>(null);

    let engine: Matter.Engine;
    let render: Matter.Render;
    let runner: Matter.Runner;

    onMounted(() => {
      if (!game.value) return;

      engine = Engine.create();

      render = Render.create({
        element: game.value,
        engine: engine,
        options: {
          width: 800,
          height: 600,
          wireframes: false,
        },
      });

      const ballA = Bodies.circle(380, 100, 40, { restitution: 0.5 });
      const ground = Bodies.rectangle(400, 580, 810, 40, { isStatic: true });

      World.add(engine.world, [ballA, ground]);

      Matter.Events.on(engine, 'beforeUpdate', function() {
          const speed = 3;
          let vx = 0;
          let vy = 0;
          document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') vx = -speed 
            else if (e.key === 'ArrowRight') vx = speed
            console.log(vx)
            Matter.Body.setVelocity(ballA, { x: vx, y: vy });
          })
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

    return { game};
  },
});
</script>
