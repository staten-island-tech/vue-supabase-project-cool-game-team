<script setup>
//definePageMeta({middleware: 'auth'})
import { reactive } from 'vue'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
let matches = reactive([])
const { data, error } = await supabase.from('matches').select('*')
if(data){
    data.forEach((m) => {
        if(Object.keys(m.players).length < 2){
            matches.push({uuid: m.uuid, players: m.players})
        }
    })
}

await supabase.realtime.setAuth()

const changes = supabase.channel('matches:players',{
    config: {private: true}
})
.on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'matches'
}, (payload) => {
    switch(payload.eventType){
        case 'INSERT':{
            if(Object.keys(payload.new.players).length < 2) matches.push({ uuid: payload.new.uuid, players: payload.new.players})
            break
        }
        case 'DELETE':{
            const index = matches.findIndex(match => match.uuid === payload.old.uuid)
            if (index !== -1) matches.splice(index, 1)
            break
        }
        case 'UPDATE':{
            const index = matches.findIndex(m => m.uuid === payload.new.uuid)
            if (index !== -1){
                if(Object.keys(payload.new.players).length >= 2){
                    matches.slice(index, 1)
                } else {
                    matches[index] = { uuid: payload.new.uuid, players: payload.new.players }
                }
            }
            break
        }
    }
}).subscribe((status) => {
    console.log(status)
})
onUnmounted(() => {supabase.removeChannel(changes)})

async function createMatch(){
  const { data, error } = await supabase.from('matches').insert({ players: { p1: user.value.sub } })
  if (error) console.error(error)
}


async function joinMatch(uuid) {
  const { data, error } = await supabase.from('matches').select('players').eq('uuid', uuid).single()

  if (!data || error) console.error(error)

  const playerCount = Object.keys(data.players).length
  if (playerCount >= 2) return console.error('too many')

  const updatedPlayers = { ...data.players, p2: user.value.sub }

  const { error: updateError } = await supabase.from('matches').update({ players: updatedPlayers }).eq('uuid', uuid)

}

</script>

<template>
<div class="w-300 h-200 overflow-y-scroll overflow-x-hidden">
    <div v-for="match in matches">
        <div @click='joinMatch(match.uuid)'>
            <p>{{ match.uuid }}</p>
            <p>{{ Object.keys(match.players).length }}/2 players</p>
        </div>
    </div>
</div>
<button @click="createMatch">createMatch</button>
</template>