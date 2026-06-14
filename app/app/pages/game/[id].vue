<template>
  <div class="flex flex-row overflow-hidden w-screen h-screen">
    <player @gameData="sendCreatedFruit" @moveFruit="sendFruitMove"/>
    <opponent :state="opponentState" :opponentMoveFruit="opponentMoveFruit"/>
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client'
import { ref, onMounted, onBeforeUnmount } from "vue"
import player from '../components/player.vue'
import opponent from '../components/opponent.vue'
import type {MoveFruit} from "~/utils/types"

definePageMeta({ ssr: false, middleware: [] })
const opponentState = ref<any>(null)
const opponentMoveFruit = ref<MoveFruit | null>(null)
let socket: any = null
const connected = ref(false)
//to do: for the final version make it not local host
onMounted(() => {
  socket = io('http://localhost:3002')

  socket.on('connect', () => {
    connected.value = true
    socket.emit('join-game', '123')
  }) //123 is a placeholder

  socket.on('opponent-state', (state: any) => {
    opponentState.value = state
  })
  socket.on('opponent-move-fruit', (data: MoveFruit) => {
    if (!socket.connected) return;
    
    opponentMoveFruit.value = data
  })
})
function sendCreatedFruit(data: any) {
  if (!connected.value) return
  socket.emit('game-state', '123', data)
  opponentState.value = data
}

function sendFruitMove(data: { id: number, x: number; y: number }) {
  socket.emit("move-fruit", '123', data);
}

onBeforeUnmount(() => {
  socket.disconnect()
})
</script>