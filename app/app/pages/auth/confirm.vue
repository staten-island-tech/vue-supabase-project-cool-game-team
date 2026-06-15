<script setup lang="ts">
definePageMeta({ ssr: false });

const supabase = useSupabaseClient();
const hash = useRoute().query.token_hash as string;

if (!hash) {
  await navigateTo('/error', { redirectCode: 401 });
}
/**
 * user clicks on a magic link sent to email which has a hash in url, takes it and verifies with supabase
 */
const { data, error } = await supabase.auth.verifyOtp({
  token_hash: hash,
  type: 'email',
});


const {
  data: { session },
} = await supabase.auth.getSession();


if (error) {
  await navigateTo('/error', { redirectCode: 401 });
}
navigateTo('/search');
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 flex items-center justify-center px-4"
  >
    <!-- Card -->
    <div
      class="card w-full max-w-lg bg-base-100/90 backdrop-blur-xl shadow-2xl border border-base-300"
    >
      <div class="card-body items-center text-center py-14">

        <!-- Animated Loader -->
        <div class="mb-8">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <!-- Heading -->
        <h1
          class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Confirming Email
        </h1>

        <!-- Description -->
        <p class="mt-5 text-base-content/70 text-lg leading-relaxed max-w-md">
          Please wait while we securely verify your email address and log you in.
        </p>

        <!-- Progress Bar -->
        <progress
          class="progress progress-primary w-56 mt-8"
        ></progress>

        <!-- Small Footer -->
        <p class="text-sm text-base-content/50 mt-6">
          This should only take a few seconds...
        </p>

      </div>
    </div>
  </div>
</template>