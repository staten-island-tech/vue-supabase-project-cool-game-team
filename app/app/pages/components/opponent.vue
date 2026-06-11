<template>
  <div 
  :style="{ transform: `scale(${scale})`, transformOrigin: 'top left' }"
  class="relative overflow-hidden w-screen h-screen border-2 border-white bg-black">
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
const props = defineProps(['state'])

definePageMeta({ ssr: false, middleware: [] });
import { useMatchStore } from '~/stores/match'

const matchStore = useMatchStore()
const fruitTypes = matchStore.fruitTypes
const scale = matchStore.scale
console.log(props.state)


</script>