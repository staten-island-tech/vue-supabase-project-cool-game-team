<script setup lang="ts">
definePageMeta({ ssr: false });

const email = ref('');
const loading = ref(false);
const supabaseClient = useSupabaseClient();

/**
 * sends login request to backend which then sends magic link to email if successful, redirects to /account
 */
 async function logInRequest() {
  try {
    loading.value = true;

    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/account`
      }
    });

    if (error) throw error;

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20  flex flex-col items-center justify-center px-4 gap-4"
  >
    <div class="alert alert-warning w-full max-w-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z" />
      </svg>
      <span>
        Click <strong>Sign In</strong> only once.
        Repeated requests may trigger email rate limits and prevent additional
        magic links from being sent.
      </span>
    </div>

    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body">
        
        <!-- Header -->
        <div class="text-center mb-6">
          <h1 class="text-4xl font-extrabold text-primary">
            Log in
          </h1>
          <p class="text-base-content/70 mt-2">
            Sign in with your email to continue
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="logInRequest" class="space-y-5">

          <!-- Email -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Email Address</span>
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="example@example.com"
              class="input input-bordered input-primary w-full focus:outline-none"
              required
            />
          </div>

          <!-- Submit -->
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary w-full text-white text-lg"
              :class="{ loading: loading }"
              :disabled="loading"
            >
              {{ loading ? 'Sending Magic Link...' : 'Sign In' }}
            </button>
          </div>
          <p class="text-center text-xs text-base-content/60 mt-2">
            After clicking Sign In, log in with the magic link sent to your email.
            If you don't see it, check your spam folder.
          </p>

        </form>
      </div>
    </div>
  </div>
</template>