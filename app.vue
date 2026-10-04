<script setup>
const { theme, initTheme } = useTheme()
onMounted(() => initTheme())
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-200"
    :class="theme === 'light' ? 'bg-slate-100' : 'bg-neutral-950'"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
