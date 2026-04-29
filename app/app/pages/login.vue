<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const email = ref('')
const password = ref('')
const loading = ref(false)
const config = useRuntimeConfig();
const supabaseClient = createClient(config.public.supabaseUrl, config.public.supabasePublishableKey)

async function logInRequest() {
  try{
    loading.value = true;
    const { error } = await supabaseClient.auth.signInWithOtp({ email: email.value })
    if (error) throw error;
    alert("wait")
  } catch (error){
    if(error instanceof Error){

    }
  }
}


</script>
<template>
    <form @submit.prevent="logInRequest">
      <div>
        <h1 class="header"">welcome to register</h1>
      </div>
      <div>
        <input type="email" placeholder="example@example.com">
        <input type="text" placeholder="123">
      </div>
      <div>
        <input type="submit" :value="loading ? 'Loading' : 'Signup/Register'" :disabled="loading" />">
      </div>

    </form>
</template>