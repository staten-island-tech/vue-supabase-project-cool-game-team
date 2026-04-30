<script setup lang="ts">
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();
definePageMeta({ ssr: false });
watch(user, () => {
  if (user.value) {
    const path = redirectInfo.pluck()
    if (path) {
      navigateTo(path);
    } else {
      navigateTo('/home');
    }
  } else {
    navigateTo('/login');
  }
},{ immediate: true });
</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Confirming your email...</h1>
        <p class="text-lg text-gray-600">Please wait while we confirm your email address.</p>
        </div>
    </div>
</template>