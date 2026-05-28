<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200 p-6">
    <div class="card w-full max-w-sm bg-base-100 shadow-xl border border-base-300">
      <div class="card-body items-center text-center">
        <!-- Avatar/Profile Icon -->
        <div class="avatar placeholder mb-4">
          <div class="bg-neutral text-neutral-content rounded-full w-20 h-20 pt-5">
            <span class="text-3xl font-bold">{{ username.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        
        <!-- Username -->
        <h2 class="card-title text-2xl font-bold text-base-content">{{ username }}</h2>
        <p class="text-xs text-base-content/60">Verified User</p>

        <!-- Wins Stat -->
        <div class="stats bg-base-200 shadow mt-6 w-full">
          <div class="stat place-items-center py-4">
            <div class="stat-title text-sm">Total Wins</div>
            <div class="stat-value text-primary text-4xl flex items-center gap-2 mt-1">
              {{ wins }}

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user_data = await supabase.auth.getUser()
const username = user_data['data']['user']['email'].split('@')[0]
const id = user_data['data']['user']['id']
const { data , error }= await supabase.from('profile').select('wins').eq('id', id)
const wins = data[0]['wins']
</script>