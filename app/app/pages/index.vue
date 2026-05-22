<template>
  <div
    class="min-h-screen bg-linear-to-br from-primary/20 via-base-200 to-secondary/20 flex items-center justify-center p-6"
  >
    <div class="card w-full max-w-xl bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body items-center text-center">
        <div class="avatar placeholder mb-4">
          <div class="bg-primary text-primary-content rounded-full w-20">
            <img src="/logo.png">
          </div>
        </div>
        <div class="flex f">
            <h1 class="text-4xl font-extrabold text-base-content">
          Welcome to
          <span class="text-primary">Knock Off Multiplayer Suika Game</span>
        </h1>
        </div>

        <p class="text-base-content/70 mt-2 max-w-md">
          Merge fruits, compete with friends, and create the biggest watermelon
          possible.
        </p>

        <div class="mt-6">
          <NuxtLink
            to="/auth/login"
            class="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:scale-105 transition-transform"
          >
            Log in / Sign up
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>