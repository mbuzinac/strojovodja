<script setup>
const props = defineProps({
  questions: { type: Array, required: true },
  categoryTitle: { type: String, default: '' },
  modeTitle: { type: String, default: '' },
})

const emit = defineEmits(['close', 'finished'])

const { recordQuiz } = useProgress()
const assetPath = useAssetPath()

const currentQuestionImage = computed(() => assetPath(currentQuestion.value?.image))

const currentIndex = ref(0)
const selectedIndex = ref(null)
const answered = ref(false)
const finished = ref(false)
const score = ref(0)
const streak = ref(0)
const bestStreak = ref(0)

const currentQuestion = computed(() => props.questions[currentIndex.value])
const total = computed(() => props.questions.length)
const progress = computed(() => ((currentIndex.value + (answered.value ? 1 : 0)) / total.value) * 100)

const typeBadge = computed(() => {
  const t = currentQuestion.value?.type
  if (t === 'signal') return { label: 'Signal', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
  if (t === 'theory') return { label: 'Teorija', class: 'bg-violet-500/20 text-violet-300 border-violet-500/40' }
  if (t === 'recall') return { label: 'Učenje', class: 'bg-sky-500/20 text-sky-300 border-sky-500/40' }
  return { label: 'Ispit', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
})

const isRecall = computed(() =>
  currentQuestion.value?.type === 'recall'
  || !currentQuestion.value?.options?.length,
)

const revealed = ref(false)

function playHorn() {
  try {
    const audio = new Audio(assetPath('/sounds/locomotive-horn.mp3'))
    audio.volume = 0.7
    audio.play().catch(() => {})
  } catch { /* */ }
}

function selectAnswer(index) {
  if (answered.value || finished.value) return
  selectedIndex.value = index
  answered.value = true

  if (index === currentQuestion.value.correctIndex) {
    score.value++
    streak.value++
    if (streak.value > bestStreak.value) bestStreak.value = streak.value
    playHorn()
  } else {
    streak.value = 0
  }
}

function nextQuestion() {
  if (currentIndex.value < total.value - 1) {
    currentIndex.value++
    selectedIndex.value = null
    answered.value = false
    revealed.value = false
  } else {
    finished.value = true
    emit('finished', { score: score.value, total: total.value })
  }
}

function revealAnswer() {
  revealed.value = true
}

function markRecall(knewIt) {
  if (answered.value) return
  answered.value = true
  if (knewIt) {
    score.value++
    streak.value++
    if (streak.value > bestStreak.value) bestStreak.value = streak.value
    playHorn()
  } else {
    streak.value = 0
  }
}

function closeModal() {
  emit('close')
}

function optionClass(index) {
  if (!answered.value) {
    return 'bg-slate-800 border-slate-600 hover:border-cyan-500/50 hover:bg-slate-700 active:scale-[0.99]'
  }
  if (index === currentQuestion.value.correctIndex) {
    return 'bg-emerald-900/60 border-emerald-500 text-emerald-100'
  }
  if (index === selectedIndex.value) {
    return 'bg-red-900/60 border-red-500 text-red-100'
  }
  return 'bg-slate-800/50 border-slate-700 text-slate-500'
}

const pct = computed(() => (total.value ? Math.round((score.value / total.value) * 100) : 0))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/85 backdrop-blur-sm" @click="closeModal" />

      <div class="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-cyan-500/10">
        <div class="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-5 py-4">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div>
              <h2 class="text-lg font-bold text-white">
                {{ finished ? 'Rezultat' : (modeTitle || 'Kviz') }}
              </h2>
              <p v-if="categoryTitle && !finished" class="text-xs text-slate-500">{{ categoryTitle }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="!finished && streak >= 2" class="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                🔥 {{ streak }}
              </span>
              <button type="button" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Zatvori" @click="closeModal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="!finished" class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300" :style="{ width: `${progress}%` }" />
          </div>
          <p v-if="!finished" class="text-xs text-slate-500 mt-1.5">
            {{ currentIndex + 1 }} / {{ total }}
          </p>
        </div>

        <div v-if="finished" class="p-6 text-center">
          <div class="text-6xl mb-3 animate-bounce">
            {{ pct >= 80 ? '🚂' : pct >= 50 ? '🛤️' : '📖' }}
          </div>
          <p class="text-4xl font-black neon-text mb-1">{{ score }} / {{ total }}</p>
          <p class="text-lg text-slate-400 mb-1">{{ pct }}%</p>
          <p v-if="bestStreak >= 3" class="text-sm text-amber-400 mb-4">Najbolji niz točnih: {{ bestStreak }} 🔥</p>
          <p class="text-slate-400 text-sm mb-6">
            {{ pct >= 80 ? 'Odlično! Spreman si za ispit.' : pct >= 50 ? 'Solidno – još malo vježbe.' : 'Ponovi lekcije i flash kartice.' }}
          </p>
          <button type="button" class="btn-primary w-full" @click="closeModal">Zatvori</button>
        </div>

        <div v-else class="p-5 pb-8">
          <span
            class="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border mb-3"
            :class="typeBadge.class"
          >
            {{ typeBadge.label }}
          </span>

          <div v-if="currentQuestion.image" class="mb-4 flex justify-center">
            <div class="rounded-xl overflow-hidden border border-slate-700 bg-black/50 p-2 max-w-[200px]">
              <img
                :src="currentQuestionImage"
                alt="Signal"
                class="w-full h-auto object-contain max-h-40"
              />
            </div>
          </div>

          <p class="text-base font-medium text-slate-100 leading-relaxed mb-5">
            {{ currentQuestion.question }}
          </p>

          <!-- Pitanja tipa „nabroji / objasni“ – bez lažnih odgovora -->
          <template v-if="isRecall">
            <button
              v-if="!revealed"
              type="button"
              class="w-full py-3.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 font-medium text-sm mb-4"
              @click="revealAnswer"
            >
              Prikaži odgovor
            </button>

            <div
              v-if="revealed"
              class="mb-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30"
            >
              <p class="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Odgovor</p>
              <p class="text-sm text-emerald-100/90 leading-relaxed whitespace-pre-wrap">{{ currentQuestion.explanation }}</p>
            </div>

            <div v-if="revealed && !answered" class="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                class="py-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 font-medium text-sm"
                @click="markRecall(false)"
              >
                Treba ponoviti
              </button>
              <button
                type="button"
                class="py-3 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 font-medium text-sm"
                @click="markRecall(true)"
              >
                Znao sam ✓
              </button>
            </div>
          </template>

          <div v-else class="space-y-2.5 mb-4">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              type="button"
              class="w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200"
              :class="optionClass(index)"
              :disabled="answered"
              @click="selectAnswer(index)"
            >
              <span class="inline-flex items-start gap-2">
                <span class="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  :class="answered && index === currentQuestion.correctIndex ? 'border-emerald-400 text-emerald-400' : 'border-slate-500 text-slate-400'">
                  {{ String.fromCharCode(65 + index) }}
                </span>
                <span class="leading-snug">{{ option }}</span>
              </span>
            </button>
          </div>

          <div v-if="answered && !isRecall" class="mb-4 p-4 rounded-xl bg-slate-800/80 border border-cyan-500/30">
            <p class="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Objašnjenje</p>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{{ currentQuestion.explanation }}</p>
          </div>

          <button v-if="answered" type="button" class="btn-primary w-full" @click="nextQuestion">
            {{ currentIndex < total - 1 ? 'Sljedeće →' : 'Prikaži rezultat' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
