<script setup>
const props = defineProps({
  quiz: { type: Object, default: null },
  step: { type: Number, default: 0 },
})

const emit = defineEmits(['answer', 'skip'])

const assetPath = useAssetPath()
const selected = ref(null)

const currentQuestion = computed(() => {
  if (!props.quiz) return null
  return props.step === 0
    ? { text: props.quiz.question, options: props.quiz.options, correct: props.quiz.correctIndex }
    : { text: props.quiz.actionQuestion, options: props.quiz.actionOptions, correct: props.quiz.actionCorrectIndex }
})

watch(() => props.quiz, () => { selected.value = null })
watch(() => props.step, () => { selected.value = null })

function pick(i) {
  if (selected.value !== null) return
  selected.value = i
  setTimeout(() => emit('answer', i), 400)
}

function optionClass(i) {
  if (selected.value === null) {
    return 'bg-slate-800 border-slate-600 hover:border-cyan-500/50 hover:bg-slate-700 active:scale-[0.99]'
  }
  if (i === currentQuestion.value.correct) {
    return 'bg-emerald-900/60 border-emerald-500 text-emerald-100'
  }
  if (i === selected.value) {
    return 'bg-red-900/60 border-red-500 text-red-100'
  }
  return 'bg-slate-800/50 border-slate-700 text-slate-500'
}
</script>

<template>
  <Teleport to="body">
    <div v-if="quiz" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div class="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-amber-500/10">
        <div class="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-5 py-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                {{ step === 0 ? 'Što je ovo?' : 'Što učiniti?' }}
              </p>
              <h3 class="text-lg font-bold text-white">Signal na pruzi</h3>
            </div>
            <button
              type="button"
              class="text-xs text-slate-500 hover:text-slate-300 px-2 py-1"
              @click="emit('skip')"
            >
              Preskoči
            </button>
          </div>
          <div class="flex gap-1 mt-3">
            <div class="h-1 flex-1 rounded-full" :class="step >= 0 ? 'bg-amber-500' : 'bg-slate-700'" />
            <div class="h-1 flex-1 rounded-full" :class="step >= 1 ? 'bg-amber-500' : 'bg-slate-700'" />
          </div>
        </div>

        <div class="px-5 py-4">
          <div v-if="quiz.signal" class="mb-4 flex justify-center">
            <div class="rounded-xl border border-slate-700 bg-black/40 p-3 w-full max-w-[200px]">
              <SignalVisual :visual="quiz.signal.visual" :alt="quiz.signal.name" />
            </div>
          </div>
          <div v-else class="mb-4 flex justify-center text-5xl">🚦</div>

          <p class="text-white font-medium mb-4 leading-relaxed">{{ currentQuestion?.text }}</p>

          <div class="space-y-2">
            <button
              v-for="(opt, i) in currentQuestion?.options"
              :key="i"
              type="button"
              class="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
              :class="optionClass(i)"
              @click="pick(i)"
            >
              <span class="font-bold mr-2 text-slate-500">{{ String.fromCharCode(97 + i) }})</span>
              {{ opt }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
