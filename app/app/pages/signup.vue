<script setup lang="ts">
definePageMeta({ ssr: false });
const email = ref('')
const password = ref('')
const loading = ref(false)

const supabaseClient = useSupabaseClient();

async function logInRequest() {
  try{
    loading.value = true;
    const { error } = await supabaseClient.auth.signUp({
      email: email.value,
      password: password.value
    })
    if (error) throw error;
    alert("wait")
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
        <h1 class="header">welcome to register</h1>
      </div>
      <div>
        <input v-model="email" type="email" placeholder="example@example.com">
        <input v-model="password" type="password" placeholder="password" >
      </div>
      <div>
        <input type="submit" :value="loading ? 'Loading' : 'Signup/Register'" :disabled="loading" />
      </div>

    </form>
</template>