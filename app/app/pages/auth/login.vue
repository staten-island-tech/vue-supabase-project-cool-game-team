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
    class="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 flex items-center justify-center px-4"
  >
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

        </form>
      </div>
    </div>
  </div>
</template>