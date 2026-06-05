<template>
  <div class="min-h-screen bg-base-300 flex items-center justify-center p-6">
    <div class="card w-full max-w-sm bg-base-100 shadow-2xl border border-base-content/10 rounded-3xl overflow-hidden">
      
      <!-- Top gradient banner -->
      <div class="h-24 bg-gradient-to-br from-primary via-secondary to-accent opacity-80" />

      <div class="card-body items-center text-center -mt-12 pb-8 px-8 gap-0">

        <!-- Avatar -->
        <div class="avatar placeholder mb-3">
          <div class="bg-base-100 ring ring-base-100 ring-offset-base-100 ring-offset-2 text-primary rounded-full w-20 h-20 shadow-lg border-4 border-base-100">
            <span class="text-3xl font-black">{{ username.charAt(0).toUpperCase() }}</span>
          </div>
        </div>

        <!-- Username + badge -->
        <h2 class="text-xl font-black tracking-tight text-base-content mt-1">{{ username }}</h2>
        <div class="badge badge-success badge-sm gap-1 mt-1 mb-6 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          Verified
        </div>

        <!-- Divider -->
        <div class="divider w-full my-0 mb-4" />

        <!-- Wins stat -->
        <div class="stats bg-base-200 shadow-inner w-full rounded-2xl border border-base-content/5 mb-6">
          <div class="stat place-items-center py-5">
            <div class="stat-title text-xs font-bold tracking-widest uppercase opacity-50">Total Wins</div>
            <div class="stat-value text-primary text-5xl font-black mt-1 tabular-nums">{{ wins }}</div>
            <div class="stat-desc mt-1 text-xs opacity-40">all time</div>
          </div>
        </div>

        <!-- Logout -->
        <button
          class="btn btn-outline btn-error btn-sm w-full rounded-xl gap-2 font-bold"
          @click="logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const username = ref('')
const wins = ref(0)

watch(user, async (newUser) => {
  if (newUser) {
    username.value = newUser.email.split('@')[0]
    const { data, error } = await supabase.from('profile').select('wins').eq('id', newUser.id).single()
    if (data) wins.value = data.wins
  }
}, { immediate: true })
async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error === null) {
    await navigateTo({ path: '/' })
  }
}
</script>