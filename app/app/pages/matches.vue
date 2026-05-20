<template>
  <div ref="game">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount} from "vue";
import Matter from "matter-js";

//definePageMeta({ ssr: false });
definePageMeta({ ssr: false });

const { Engine, Render, Runner, Bodies, World, Composite } = Matter;

type fallingfruit = {
  name: string,
  x: number,
  y: number,
  type: string
  hitbox?: number 
  //to do: figure out how to do hitboxes
  //type isnt used rn bc we don't have the actual assets yet but we'll use the type to determine the hitbox
}
type fallingFruits = fallingfruit[]
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
          height: 900,
          wireframes: false,
        },
      });

      //filler fruits, add the real hitboxes of the assets later
      
      const ground = Bodies.rectangle(400, 800, 810, 40, { isStatic: true });
      const leftWall = Bodies.rectangle(10, 200, 20, 1160, { isStatic: true });
      const rightWall = Bodies.rectangle(785, 200, 20, 1160, { isStatic: true });
      const containerTop = Bodies.rectangle(397, 100, 755, 20, { isStatic: true, isSensor: true, render: {fillStyle: 'red', opacity: 0.3}})

      function createNewFallingFruit() {
        //this needs to happen infinitely in a loop until the user loses- while true?
        const fruit =  Bodies.circle(380, 100, 40, { restitution: 0.5 });
        Composite.add(engine.world, fruit);
        return fruit
      }
      let fruit: any;
      World.add(engine.world, [ground, leftWall, rightWall, containerTop]);
      Matter.Events.on(engine, 'beforeUpdate', function() {
          //to do: get current falling fruit
          const speed = 3; //to do: adjustable speed
          let vx = 0;
          let vy = 0;
          document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') vx = -speed 
            else if (e.key === 'ArrowRight') vx = speed
            Matter.Body.setVelocity(fruit, { x: vx, y: vy });
          })
      });
      
      Matter.Events.on(engine, 'collisionStart', function(event) {
        let pairs = event.pairs;

        pairs.forEach(function(pair) {
          const labels = [pair.bodyA.label, pair.bodyB.label];
        
        if (labels.includes('Circle Body') && labels.includes('Rectangle Body')) {
            //to do: connect w/ lose page/indicator
            navigateTo('/lose')
          } 
    });
    
});


      setInterval(() => {
        fruit = createNewFallingFruit()
      }, 2000);
      
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
