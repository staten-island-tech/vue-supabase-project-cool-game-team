<template>
    <div>
        <Matches/>
        <Opponent/>
    </div>
</template>

<script setup lang="ts">
import { useGameRoom } from '../composables/useGameRoom';
const route = useRoute()

const roomId = route.params.roomId as string

const {
  sendBoardUpdate,
  onBoardUpdate,
  cleanup
} = useGameRoom(roomId)
const opponentFruits = ref([])
const opponentScore = ref(0)
onBoardUpdate(payload => {
  opponentFruits.value = payload.fruits
  opponentScore.value = payload.score
})
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>

</style>