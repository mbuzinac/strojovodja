<script setup>
const props = defineProps({
  src: { type: String, default: '' },
  label: { type: String, default: '' },
})

const emit = defineEmits(['close'])

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    v-if="src"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-4 backdrop-blur-sm"
    @click="emit('close')"
  >
    <p v-if="label" class="text-sm font-bold uppercase tracking-wider text-amber-400">
      {{ label }}
    </p>
    <img
      :src="src"
      :alt="label || 'Signal'"
      class="max-h-[80vh] max-w-full rounded-xl bg-white/5 object-contain p-3"
    />
    <p class="text-xs text-slate-400">Klikni bilo gdje za zatvaranje</p>
  </div>
</template>
