<script setup>
const props = defineProps({
  signals: { type: Array, required: true },
})

const emit = defineEmits(['seen'])

const index = ref(0)
const flipped = ref(false)
const known = ref(0)

const current = computed(() => props.signals[index.value])
const total = computed(() => props.signals.length)
const done = computed(() => index.value >= total.value)

function flip() {
  flipped.value = !flipped.value
}

function next(knewIt) {
  if (knewIt) known.value++
  emit('seen', index.value)
  flipped.value = false
  if (index.value < total.value - 1) {
    index.value++
  } else {
    index.value = total.value
  }
}

function restart() {
  index.value = 0
  flipped.value = false
  known.value = 0
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="!done && current" class="perspective-1000">
      <button
        type="button"
        class="w-full min-h-[280px] relative transition-transform duration-500 preserve-3d"
        :class="flipped ? '[transform:rotateY(180deg)]' : ''"
        style="transform-style: preserve-3d"
        @click="flip"
      >
        <!-- Prednja strana -->
        <div
          class="absolute inset-0 backface-hidden card-dark flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-cyan-500/20"
          style="backface-visibility: hidden"
        >
          <p class="text-xs text-cyan-400 uppercase tracking-widest mb-4">Koji je ovo signal?</p>
          <SignalVisual :visual="current.visual" :alt="current.name" />
          <p class="text-xs text-slate-500 mt-4">Dodirni karticu za odgovor</p>
        </div>

        <!-- Stražnja strana -->
        <div
          class="absolute inset-0 backface-hidden card-dark flex flex-col justify-center p-6 rounded-2xl border-2 border-emerald-500/30 [transform:rotateY(180deg)]"
          style="backface-visibility: hidden"
        >
          <h3 class="text-lg font-bold text-cyan-300 mb-3 text-center">{{ current.name }}</h3>
          <p class="text-sm text-slate-300 leading-relaxed text-center">{{ current.description }}</p>
        </div>
      </button>

      <p class="text-center text-xs text-slate-500 mt-2">
        Kartica {{ index + 1 }} / {{ total }}
      </p>

      <div v-if="flipped" class="grid grid-cols-2 gap-3 mt-4">
        <button type="button" class="py-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 font-medium text-sm" @click="next(false)">
          Još učim
        </button>
        <button type="button" class="py-3 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 font-medium text-sm" @click="next(true)">
          Znam ✓
        </button>
      </div>
    </div>

    <div v-else class="card-dark p-8 text-center rounded-2xl border border-emerald-500/30">
      <p class="text-4xl mb-3">🎉</p>
      <p class="text-xl font-bold text-white mb-1">Flash kartice gotove!</p>
      <p class="text-slate-400 mb-4">
        Znao si <span class="text-emerald-400 font-bold">{{ known }}</span> od {{ total }} signala
      </p>
      <button type="button" class="btn-primary" @click="restart">Ponovi</button>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>
