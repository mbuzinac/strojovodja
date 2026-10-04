<script setup>
const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path.endsWith('/strojovodja') || route.path.endsWith('/strojovodja/'))
</script>

<template>
  <div class="min-h-screen">
    <header class="app-topbar sticky top-0 z-50 border-b border-slate-800 bg-neutral-950/95 backdrop-blur-xl">
      <div class="mx-auto flex h-12 max-w-4xl items-center gap-3 px-4">
        <NuxtLink
          to="/"
          class="flex min-w-0 items-center gap-2 rounded-lg py-1 pr-2 text-sm font-semibold text-white transition-colors hover:text-cyan-300"
          :aria-current="isHome ? 'page' : undefined"
        >
          <span class="text-lg" aria-hidden="true">🚂</span>
          <span class="truncate">Strojovođa</span>
        </NuxtLink>

        <div class="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>

    <slot />
  </div>
</template>
