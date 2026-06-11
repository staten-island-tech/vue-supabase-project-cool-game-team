<template>
    <div class="bg-red-200 w-screen h-screen">
        <div class="text-center">
            <h1 class="text-9xl font-bold py-20">YOU LOST</h1>
            <p>You survived {{ timeSurvived }}</p>
        </div>
    </div>

</template>

<script setup lang="ts">
    const route = useRoute()
    const timeSurvived = route.query.timeSurvived
</script>

<style scoped>

</style>