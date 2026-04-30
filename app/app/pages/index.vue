<template>
    <div>
        <p>tetstt</p>
    </div>
</template>

<script lang="ts" src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.15.0/matter.min.js">
// 1. Module aliases
const { Engine, Render, Runner, Bodies, World } = Matter;

// 2. Create engine
const engine = Engine.create();

// 3. Create renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false // Set to false to see filled shapes
    }
});

// 4. Create bodies and ground
const boxA = Bodies.rectangle(400, 200, 80, 80);
const ballA = Bodies.circle(380, 100, 40, { restitution: 0.5 });
const ground = Bodies.rectangle(400, 580, 810, 40, { isStatic: true });

// 5. Add bodies to world
World.add(engine.world, [boxA, ballA, ground]);

// 6. Run renderer and engine
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

</script>

<style scoped>

</style>