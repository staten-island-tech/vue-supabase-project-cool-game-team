import { defineStore } from 'pinia'
import type { Database } from '../../database.types'
import { usePlayerStore } from './player'




type Match = Database['public']['Tables']['matches']['Row']


export const useMatchStore = defineStore('matchStore', () => {
    const playerStore =  usePlayerStore()

    const matches = reactive<Match[]>([])
    const inAMatch = ref(false)
    const currentMatchUUID = ref('')
    const playerUsernames = reactive<string[]>([])

    const isMatchFull = computed<boolean>(() => !!currentMatchData.value && Object.keys(currentMatchData.value.players as object as Record<string, string>).length >= 2)
    const isUserHost = computed(() => currentMatchData.value?.players?.p1 === playerStore.uuid)
    const currentMatchData = computed(() => matches.find(m => m.uuid === currentMatchUUID.value))
    return { matches, inAMatch, currentMatchData, playerUsernames, isMatchFull, isUserHost, currentMatchUUID}
}, {persist: true})