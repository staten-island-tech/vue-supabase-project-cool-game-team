<template>
    <h1>hi</h1>
</template>

<script>
const supabase = useSupabaseClient()
supabase.auth.getUser()
</script>