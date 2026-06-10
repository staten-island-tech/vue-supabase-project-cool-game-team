import { defineStore } from "pinia";

export const usePlayerStore = defineStore('playerStore', () => {
    const uuid = ref('')

    return { uuid }
})