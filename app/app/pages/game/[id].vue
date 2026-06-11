<template>
  <div class="flex flex-row overflow-hidden w-screen h-screen">
    <player @gameData="sendToSocket" />
    <opponent :state="opponentState"/>
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
const socket = io('http://localhost:3002', { reconnection: true })
//to do: for the final version make it not local host
socket.on('connect', () => console.log('connected'))

function sendToSocket(data: any) {
  socket.emit('game-state', matchStore.currentMatchUUID, data)
  opponentState.value = data
}

onMounted(() => {
  socket.emit('join-game', matchStore.currentMatchUUID)

  socket.on('opponent-state', (state) => {
    opponentState.value = state
    console.log('opponent state:', state)
  })
  //to do: the syncing gets hella messed up when the user goes to another tab or app
  //make opponent disconnected/you disconnected page if 
  socket.on('error', (err) => console.error('socket error:', err))
socket.on('disconnect', (reason) => console.log('disconnected:', reason))
})

onBeforeUnmount(() => {
  socket.disconnect()
})
</script>