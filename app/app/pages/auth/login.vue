<script setup lang="ts">
definePageMeta({ ssr: false });
const email = ref('');
const password = ref('');
const loading = ref(false);
const supabaseClient = useSupabaseClient();

async function logInRequest() {
  try{
    loading.value = true;
    const { data } = await supabaseClient.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/home`
      }
    })
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
    <form>
      <div>
        <h1 class="header">welcome to signin/login</h1>
      </div>
      <div>
        <input v-model="email" type="email" placeholder="example@example.com">

      </div>
      <div>
        <input  @submit.prevent="logInRequest" type="submit" :value="loading ? 'Loading' : 'Sign In'" :disabled="loading" />
      </div>

    </form>
</template>