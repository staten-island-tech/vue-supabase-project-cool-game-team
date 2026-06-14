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
const opponentState = ref<any>(null)
let socket: any = null
const connected = ref(false)
//to do: for the final version make it not local host
onMounted(() => {
  socket = io('http://localhost:3002')

  socket.on('connect', () => {
    connected.value = true
    socket.emit('join-game', '123')
  }) //123 is a placeholder

    socket.on('connect_error', (err) => {
      console.error(err)
    }
)

  socket.on('opponent-state', (state: any) => {
    opponentState.value = state
  })
})
function sendToSocket(data: any) {
  if (!connected.value) return
  socket.emit('game-state', '123', data)
  opponentState.value = data
}
onBeforeUnmount(() => {
  socket.disconnect()
})
</script>