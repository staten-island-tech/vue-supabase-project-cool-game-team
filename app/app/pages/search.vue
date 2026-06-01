<script setup>
//definePageMeta({middleware: 'auth'})
const supabase = useSupabaseClient()
const { data, error } = await supabase.from('matches').select('*')

async function createMatch(){
    
}
</script>

<template>
<div class="w-300 h-200 overflow-y-scroll overflow-x-hidden">
    <div v-for="match in data">
        <div v-if="match.players.length < 2">
            <p>{{ match.uuid}}</p>
            <p>{{ match.players.length }}/2 players</p>
            <p>Created at {{ new Date(match.created_at).toLocaleString()}}</p>
        </div>
    </div>
</div>
</template>