<script setup lang="ts">
/**
 * @fileoverview - Match page where users can create or join matches, see who is in the match, and start the game when ready
 */
//definePageMeta({middleware: 'auth'})
import { reactive, computed } from 'vue'
import type { Database } from '../../database.types'
import { usePlayerStore } from '~/stores/player'
import { useMatchStore } from '~/stores/match'
import { storeToRefs } from 'pinia'
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const playerStore = usePlayerStore()
const matchStore = useMatchStore()
const {  matches, inAMatch, currentMatchData, playerUsernames, isMatchFull, isUserHost, currentMatchUUID } = storeToRefs(matchStore)

if (user.value?.sub) {
  playerStore.uuid = user.value.sub
}

if(inAMatch.value === false){
  playerUsernames.value = []
}



type Match = Database['public']['Tables']['matches']['Row']
type Player = Match['players']




const { data, error } = await supabase.from('matches').select('*')
if(data){
    data.forEach((m) => {
        if(Object.keys(m.players).length < 2){
            matches.value.push(m)
        }
    })
}
matches.value.[0].players
if(Object.values(matches.value.[0].players))
await supabase.realtime.setAuth()

/**
 * Sets up connection for db changes on matches table
 * @description On insert: adds match to matches array if not full
 * @event On delete: removes match from matches array, if current match is deleted resets inAMatch
 * @event On update: if match is in matches array and becomes full removes from matches array, if current match updates player usernames, if current match starts navigates to game page
 * @event Unsubscribes from changes on unmounted
 */

const changes = supabase.channel('matches:players',{
    config: {private: true}
})
.on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'matches'
}, async(payload) => {
    switch(payload.eventType){
        case 'INSERT':{
            if(Object.keys(payload.new.players).length < 2) matches.value.push(payload.new as Match)
            break
        }
        case 'DELETE':{
            const index = matches.value.findIndex(match => match.uuid === payload.old.uuid)
            if (index !== -1) matches.value.splice(index, 1)
            if (currentMatchUUID.value === payload.old.uuid) {
                inAMatch.value = false
                currentMatchUUID.value = ''
                
            }
            break
        }
        case 'UPDATE': {
            const index = matches.value.findIndex(m => m.uuid === payload.new.uuid)
            if (index !== -1) {
            if (Object.keys(payload.new.players).length >= 2) {
                matches.value.splice(index, 1)
            } else {
                matches.value[index] = payload.new as Match
            }
            }
            if (inAMatch.value && payload.new.uuid === currentMatchUUID.value) {
            await fetchUsernames(payload.new.players)
            }
            if (payload.new.uuid === currentMatchUUID.value && payload.new.started === true) {
                await navigateTo(`/game/${currentMatchUUID.value}`)
            }
            break
        }
    }
}).subscribe((status) => {
    console.log(status)
})
onUnmounted(() => {supabase.removeChannel(changes)})


/**
 * Sends a request to the backend to fetch the usernames of the players in the match and updates the playerUsernames array
 * @param players Player Object e.g. {p1: 'uuid1', p2: 'uuid2'}
 */
async function fetchUsernames(players: Player): Promise<void> {
  playerUsernames.value.length = 0
  const uuids = Object.values(players).filter((uuid): uuid is string => uuid !== null)
  const results = await Promise.all(
    uuids.map(async (uuid) => {
      const { data } = await supabase.rpc('get_username', { user_id: uuid })
      return (data ?? 'Unknown') as string
    })
  )
  playerUsernames.value.push(...results)
}

/**
 * Creates a new match with the current user as the host and adds it to the matches array
 */
async function createMatch(): Promise<void> {
  const { data, error } = await supabase.from('matches').insert({ players: { p1: playerStore.uuid } }).select("*").single();
  if (error || !data) return console.error(error)
  currentMatchUUID.value = data.uuid
  inAMatch.value=true
  await fetchUsernames(data.players as unknown as Player)
  
}

/**
 * Joins a match by updating the match's players column to include the current user's uuid as p2
 * @param uuid uuid of a player joining
 */
async function joinMatch(uuid: string) {
  const { data, error } = await supabase.from('matches').select('players').eq('uuid', uuid).single()

  if (!data || error) return console.error(error)

  const playerCount = Object.keys(data.players).length
  if (playerCount >= 2) return console.error('too many')

  const updatedPlayers = { ...data.players, p2: user.value?.sub }

  const { error: updateError } = await supabase.from('matches').update({ players: updatedPlayers }).eq('uuid', uuid)
  currentMatchUUID.value = uuid
  inAMatch.value=true
  await fetchUsernames(updatedPlayers as unknown as Player)


}

/**
 * Leaves a match by deleting if host leaves or updates match to remove p2 in Players
 */
async function leaveMatch() {
  if (currentMatchData.value?.players?.p1 === playerStore.uuid) {
    const { error } = await supabase.from('matches').delete().eq('uuid', currentMatchUUID.value)
    if (error) return console.error(error)
    inAMatch.value = false
    currentMatchUUID.value = ''

  } else {
    const { error: updateError } = await supabase.from('matches').update({ players: { p1: currentMatchData.value?.players.p1 } }).eq('uuid', currentMatchUUID.value)
    if (updateError) return console.error(updateError)
    inAMatch.value = false
    currentMatchUUID.value = ''
  }
}

/**
 * Starts a match by redirecting to game page and passing in match uuid as param
 */
async function startMatch(){
    const { error: updateError } = await supabase.from('matches').update({ started: true }).eq('uuid', currentMatchUUID.value)
    if (!updateError) await navigateTo(`/game/${currentMatchUUID.value}`)
}

</script>

<template>
  <!-- Lobby view -->
  <div v-if="!inAMatch" class="min-h-screen bg-base-300 flex flex-col items-center justify-center p-6 gap-6">

    <h1 class="text-4xl font-black text-base-content tracking-tight">Game Lobby</h1>

    <div class="w-full max-w-lg flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
      <template v-if="matches.length > 0">
        <div
          v-for="match in matches"
          :key="match.uuid"
          @click="joinMatch(match.uuid)"
          class="card bg-base-100 shadow-md border border-base-content/10 hover:border-primary hover:shadow-lg transition-all cursor-pointer"
        >
          <div class="card-body flex-row items-center justify-between py-4 px-6">
            <div>
              <p class="text-xs text-base-content/40 font-mono">{{ match.uuid }}</p>
              <p class="text-sm font-bold text-base-content mt-1">
                {{ Object.keys(match.players).length }}/2 players
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">Open</div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-base-content/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="card bg-base-100 border border-base-content/10 shadow-md">
        <div class="card-body items-center text-center py-12">
          <p class="text-base-content/60 font-semibold">No matches available</p>
          <p class="text-base-content/40 text-sm">Create one to get started</p>
        </div>
      </div>
    </div>

    <button @click="createMatch" class="btn btn-primary btn-wide gap-2 rounded-xl shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      Create Match
    </button>
  </div>

  <!-- In match view -->
  <div v-else class="min-h-screen bg-base-300 flex flex-col items-center justify-center p-6 gap-6">

    <h1 class="text-4xl font-black text-base-content tracking-tight">Match Room</h1>

    <div class="badge badge-outline badge-lg font-mono text-xs">{{ currentMatchUUID }}</div>

    <!-- Players card -->
    <div class="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10">
      <div class="card-body gap-4">
        <h2 class="card-title text-sm font-bold uppercase tracking-widest text-base-content/50">Players</h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="(username, index) in playerUsernames"
            :key="index"
            class="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3"
          >
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-8">
                <span class="text-sm font-black">{{ username?.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <span class="font-mono text-xs text-base-content/60">{{ username }}</span>
            <div v-if="index === 0" class="badge badge-warning badge-sm ml-auto">Host</div>
          </div>
          <!-- Empty slot -->
          <div v-if="Object.keys(currentMatchData?.players || {}).length < 2" class="flex items-center gap-3 bg-base-200/50 rounded-xl px-4 py-3 border border-dashed border-base-content/20">
            <div class="avatar placeholder">
              <div class="bg-base-300 text-base-content/30 rounded-full w-8">
                <span class="text-sm">?</span>
              </div>
            </div>
            <span class="text-base-content/40 italic text-sm">Waiting for player...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Host controls -->
    <div v-if="isUserHost" class="w-full max-w-sm">
      <button v-if="isMatchFull" @click="startMatch" class="btn btn-success btn-block rounded-xl gap-2 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Start Game
      </button>
      <div v-else class="alert alert-info rounded-xl">
        <span>Waiting for another player to join...</span>
      </div>
    </div>

    <div v-else class="alert alert-warning w-full max-w-sm rounded-xl">
      <span>Waiting for the host to start the game...</span>
    </div>
    <!-- Leave button -->
        <button @click="leaveMatch" class="btn btn-outline btn-error w-full max-w-sm rounded-xl gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        Leave Match
        </button>

</div>
  
</template>