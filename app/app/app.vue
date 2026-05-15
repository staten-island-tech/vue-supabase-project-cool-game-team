
<script setup>
import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const instruments = ref([])
definePageMeta({ ssr: false });
async function getInstruments() {
  const { data } = await supabase.from('instruments').select()
  instruments.value = data
}

onMounted(() => {
  getInstruments()
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
