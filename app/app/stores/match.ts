import { defineStore } from 'pinia'
import type { Database } from '../../database.types'
import { usePlayerStore } from './player'
import type { FruitType } from "../utils/types";

type Match = Database['public']['Tables']['matches']['Row']

export const useMatchStore = defineStore('matchStore', () => {
    const playerStore =  usePlayerStore()

    const matches = reactive<Match[]>([])
    const inAMatch = ref(false)
    const currentMatchUUID = ref('')
    const playerUsernames = reactive<string[]>([])

    const fruitTypes: Record<string, FruitType> = {
    cherry:     { img: '/img/cherry.png',     radius: 120, selectionProbability: 1 },
    strawberry: { img: '/img/strawberry.png', radius: 100, selectionProbability: 0 },
    grape:      { img: '/img/grape.png',      radius: 80, selectionProbability: 0 },
    citrus:     { img: '/img/citrus.png',     radius: 70, selectionProbability: 0 },
    apple:      { img: '/img/apple.png',      radius: 60,  selectionProbability: 0 },
    pear:       { img: '/img/pear.png',       radius: 50,  selectionProbability: 0 },
    peach:      { img: '/img/peach.png',      radius: 40,  selectionProbability: 0 },
    pineapple:  { img: '/img/pineapple.png',  radius: 30,  selectionProbability: 0 },
    melon:      { img: '/img/melon.png',      radius: 25,  selectionProbability: 0 },
    watermelon: { img: '/img/watermelon.png', radius: 20,  selectionProbability: 0},
    };
    const scale = Math.min(
        window.innerWidth / 2 / 800,   
        window.innerHeight / 900
    )
    const isMatchFull = computed<boolean>(() => !!currentMatchData.value && Object.keys(currentMatchData.value.players as object as Record<string, string>).length >= 2)
    const isUserHost = computed(() => currentMatchData.value?.players?.p1 === playerStore.uuid)
    const currentMatchData = computed(() => matches.find(m => m.uuid === currentMatchUUID.value))
    
    return { scale, fruitTypes,matches, inAMatch, currentMatchData, playerUsernames, isMatchFull, isUserHost, currentMatchUUID}
})