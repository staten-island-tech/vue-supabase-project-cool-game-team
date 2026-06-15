<template>
  <div class="flex flex-row overflow-hidden w-screen h-screen">
    <player @gameData="sendCreatedFruit" @moveFruit="sendFruitMove" @lose="handleLose"/>
    <opponent :state="opponentState" :opponentMoveFruit="opponentMoveFruit"/>
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client'
import { ref, onMounted, onBeforeUnmount } from "vue"
import player from '../components/player.vue'
import opponent from '../components/opponent.vue'
import type {MoveFruit} from "~/utils/types"

import { useMatchStore } from "~/stores/match";
const matchStore = useMatchStore();
const roomId = matchStore.currentMatchUUID

definePageMeta({ ssr: false, middleware: [] })
const opponentState = ref<any>(null)
const opponentMoveFruit = ref<MoveFruit | null>(null)
let socket: any = null
const connected = ref(false)
//to do: for the final version make it not local host
onMounted(() => {
  socket = io('https://game-server-code-production.up.railway.app')

  socket.on('connect', () => {
    connected.value = true
    console.log('connect')
    socket.emit('join-game', roomId)
  }) 

  socket.on('opponent-state', (state: any) => {
    opponentState.value = state
  })
  socket.on('opponent-move-fruit', (data: MoveFruit) => {    
    opponentMoveFruit.value = data
  })
  socket.on('opponent-lost', (timeSurvived: string) => {
    window.location.replace(`/win?timeSurvived=${timeSurvived}`)
  })
})
function handleLose(timeSurvived: string) {
  socket.emit('player-lost', roomId, timeSurvived) 
  window.location.replace(`/lose?timeSurvived=${timeSurvived}`)
}

function sendCreatedFruit(data: any) {
  if (!connected.value) return
  socket.emit('game-state', roomId, data)
  opponentState.value = data
}

function sendFruitMove(data: { id: number, x: number; y: number }) {
  socket.emit("move-fruit", roomId, data);
}

onBeforeUnmount(() => {
  socket.disconnect()
})
</script>