<template>
    <div class="bg-green-200 w-screen h-screen">
        <div class="text-center">
            <h1 class="text-9xl font-bold py-20">YOU WON</h1>
            <p>Your opponent survived {{ timeSurvived }}</p>
            <p v-if="reason === 'left'" class="text-xl mt-4">Your opponent left the game!</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute()
    const timeSurvived = route.query.timeSurvived
    const reason = route.query.reason
</script>