<template>
    <h1>Hey So account page</h1>
    <h2>{{ username }}</h2>
    <p>{{ wins }}</p>
</template>

<script>
const supabase = useSupabaseClient()
const user_data = await supabase.auth.getUser()
const username = user_data['data']['user']['email'].split('@')[0] 
const id = user_data['data']['user']['id']
const wins = await supabase.from('profile').select().eq('id', id).select('wins')
</script>