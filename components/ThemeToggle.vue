<script setup>
const { theme, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors
      border-slate-700 bg-slate-900 text-slate-300 hover:text-white
      theme-btn"
    :title="theme === 'light' ? 'Tamna tema' : 'Svijetla tema'"
    :aria-label="theme === 'light' ? 'Uključi tamnu temu' : 'Uključi svijetlu temu'"
    @click="toggle"
  >
    <span v-if="theme === 'light'" aria-hidden="true">🌙</span>
    <span v-else aria-hidden="true">☀️</span>
    <span class="hidden sm:inline">{{ theme === 'light' ? 'Tamno' : 'Svijetlo' }}</span>
  </button>
</template>
