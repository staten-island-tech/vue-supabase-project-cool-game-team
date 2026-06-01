<script setup>
//definePageMeta({middleware: 'auth'})
const supabase = useSupabaseClient()
async function getMatches(){
const { data, error } = await supabase.from('matches').select('*')
if(!error) return data
}
async function createMatch(){
    
}
</script>

<template>

</template>