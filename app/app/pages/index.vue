<template>
  <div ref="game"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import Matter from "matter-js";

definePageMeta({ ssr: false });

const { Engine, Render, Runner, Bodies, World, Composite } = Matter;
function createNewFallingItem() {
  //this needs to happen infinitely in a loop until the user loses- while true?
  const item =  Bodies.circle(380, 100, 40, { restitution: 0.5 });
  return item
}
type fallingItem = {
  name: string,
  x: number,
  y: number,
  type: string
  hitbox?: number 
  //to do: figure out how to do hitboxes
  //type isnt used rn bc we don't have the actual assets yet but we'll use the type to determine the hitbox
}
type fallingItems = fallingItem[]
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
          height: 1200,
          wireframes: false,
        },
      });

      //filler items, add the real hitboxes of the assets later
      const ballA = Bodies.circle(380, 100, 40, { restitution: 0.5 });
      const ballB = Bodies.circle(380, 100, 40, { restitution: 0.5});
      const ground = Bodies.rectangle(400, 800, 810, 40, { isStatic: true });

      World.add(engine.world, [ballA, ground]);
      Matter.Events.on(engine, 'beforeUpdate', function() {
          const item = createNewFallingItem()
          //need to shift control to the newest item
          //to do: get current falling item
          const speed = 3; //to do: adjustable speed
          let vx = 0;
          let vy = 0;
          document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') vx = -speed 
            else if (e.key === 'ArrowRight') vx = speed
            Matter.Body.setVelocity(item, { x: vx, y: vy });
          })
      });
      //delayed item
        setTimeout(() => {
      Composite.add(engine.world, ballB);
  }, 3000);
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
