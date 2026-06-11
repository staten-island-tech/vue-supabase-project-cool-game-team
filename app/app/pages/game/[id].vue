<template>
  <div class="flex gap-4">
    <player @gameData="sendToSocket" />
    
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client'
import { useMatchStore } from '~/stores/match'
import { ref, onMounted, onBeforeUnmount } from "vue"
import player from '../components/player.vue'
import opponent from '../components/opponent.vue'
definePageMeta({ ssr: false, middleware: [] })

const matchStore = useMatchStore()

const opponentState = ref<any>(null)
const socket = io('http://localhost:3000', { reconnection: true })
//to do: for the final version make it not local host
socket.on('connect', () => console.log('connected'))

function sendToSocket(data: any) {
  socket.emit('game-state', matchStore.currentMatchUUID, data)
}

onMounted(() => {
  socket.emit('join-game', matchStore.currentMatchUUID)

  socket.on('opponent-state', (state) => {
    opponentState.value = state
    console.log('opponent state:', state)
  })
})

onBeforeUnmount(() => {
  socket.disconnect()
})
</script>