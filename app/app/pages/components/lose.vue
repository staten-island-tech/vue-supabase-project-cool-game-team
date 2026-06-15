<template>
    <div class="min-h-screen w-screen bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center">
        <div class="text-center flex flex-col items-center gap-6">
            <h1 class="text-9xl font-black text-white drop-shadow-lg">YOU LOST</h1>
            <p class="text-2xl text-white/80 font-semibold">You survived {{ timeSurvived }}</p>
            <p v-if="reason === 'left'" class="text-xl text-white/70">You left the game</p>
            <button 
                @click="navigateTo('/search')" 
                class="mt-4 px-10 py-4 bg-white text-rose-600 font-black text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform">
                Play Again
            </button>
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