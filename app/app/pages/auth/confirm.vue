<script setup lang="ts">

definePageMeta({ ssr: false });
const supabase = useSupabaseClient()
// ---cut---
const { error } = await supabase.auth.verifyOtp({
  token_hash: 'hash',
  type: 'email',
})
</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Confirming your email...</h1>
        <p class="text-lg text-gray-600">Please wait while we confirm your email address.</p>
        </div>
    </div>
</template>