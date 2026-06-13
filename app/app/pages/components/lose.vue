<template>
    <div class="bg-red-200 w-screen h-screen">
        <div class="text-center">
            <h1 class="text-9xl font-bold py-20">YOU LOST</h1>
            <p>You survived {{ timeSurvived }}</p>
            <p v-if="reason === 'left'" class="text-xl mt-4">You left the game!</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps(['reason'])
    const route = useRoute()
    
    const timeSurvived = route.query.timeSurvived
    const reason = route.query.reason
</script>

<style scoped>

</style>