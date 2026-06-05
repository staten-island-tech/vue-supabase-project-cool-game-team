<script setup>
//definePageMeta({middleware: 'auth'})
const supabase = useSupabaseClient()
const { data, error } = await supabase.from('matches').select('*')
const { user, e } = await supabase.auth.getUser()

async function createMatch(){
    const { data , error } = await supabase.from('matches').insert({players: {p1: user.uuid}})
}

async function joinMatch(uuid) {
    const { data , error } = await supabase.from('matches').select('players').eq('uuid', uuid);
    if(data[0].length > 1) {
        return 'error'
    } else {
        new_Data = data[0].players.p2 = user.uuid;
        await supabase.from('matches').select('players').eq('uuid', uuid).update(new_Data)
}
}
</script>

<template>
<div class="w-300 h-200 overflow-y-scroll overflow-x-hidden">
    <div v-for="match in data">
        <div @click='joinMatch(match.uuid)' v-if="match.players.length < 2">
            <p>{{ match.uuid }}</p>
            <p>{{ match.players.length }}/2 players</p>
            <p>Created at {{ new Date(match.created_at).toLocaleString()}}</p>
        </div>
    </div>
</div>
<button @click="createMatch">createMatch</button>
</template>