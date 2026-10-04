<script setup>
useHead({ title: 'Play & Fun – Strojovođa' })
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-20">
    <header class="sticky top-12 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-3xl mx-auto px-4 py-3.5">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Natrag"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg font-bold text-white flex items-center gap-2">
              <span aria-hidden="true">🎮</span> Play & Fun
            </h1>
            <p class="text-xs text-slate-500">Vožnja · signali · kviz</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <LocomotiveGame />
    </main>
  </div>
</template>
