<template>
  <div class="relative w-[800px] h-[900px] border-2 border-white bg-black">
    <div v-if="!state" class="text-white p-4">Waiting for opponent...</div>
    <div v-else>
      <div v-for="fruit in state.fruits" :key="fruit.id"
           :style="{ position: 'absolute', left: fruit.x + 'px', top: fruit.y + 'px', transform: 'translate(-50%, -50%)' }">
        <img :src="fruitTypes[fruit.label]?.img"
             :style="{ width: fruitTypes[fruit.label]?.radius * 2 + 'px' }" />
      </div>
      <p class="absolute top-0 right-0 text-white text-4xl font-extrabold m-2">{{ state.timeSurvived }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps([''])

const fruitTypes: Record<string, any> = {
  cherry:     { img: '/img/cherry.png',     radius: 120 },
  strawberry: { img: '/img/strawberry.png', radius: 100 },
  grape:      { img: '/img/grape.png',      radius: 80  },
  citrus:     { img: '/img/citrus.png',     radius: 70  },
  apple:      { img: '/img/apple.png',      radius: 60  },
  pear:       { img: '/img/pear.png',       radius: 50  },
  peach:      { img: '/img/peach.png',      radius: 40  },
  pineapple:  { img: '/img/pineapple.png',  radius: 30  },
  melon:      { img: '/img/melon.png',      radius: 25  },
  watermelon: { img: '/img/watermelon.png', radius: 20  },
}
</script>