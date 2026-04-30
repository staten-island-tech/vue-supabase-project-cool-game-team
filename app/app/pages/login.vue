<script setup lang="ts">
definePageMeta({ ssr: false });
const email = ref('');
const password = ref('');
const loading = ref(false);
const supabaseClient = useSupabaseClient();

async function logInRequest() {
  try{
    loading.value = true;
    const { data } = await supabaseClient.auth.signInWithPassword({
      email: email.value,
      password: password.value,
      // fix this tmr, property emailRedirectTo doesn't exist
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`
      }
    })
    if (data) console.log("logged in")
  } catch (error){
    if(error instanceof Error){
      console.log(error.message)
    }
  } finally {
    loading.value = false;
  }
}


</script>
<template>
    <form @submit.prevent="logInRequest">
      <div>
        <h1 class="header">welcome to signin</h1>
      </div>
      <div>
        <input v-model="email" type="email" placeholder="example@example.com">
        <input v-model="password" type="password" placeholder="password">
      </div>
      <div>
        <input type="submit" :value="loading ? 'Loading' : 'Sign In'" :disabled="loading" />
      </div>

    </form>
</template>