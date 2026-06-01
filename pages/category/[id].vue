<script setup>
import { getCategoryById } from '~/data/database.js'

const route = useRoute()
const categoryId = computed(() => route.params.id)
const category = computed(() => getCategoryById(categoryId.value))

const { markLessonRead, markSignalSeen, recordQuiz, categoryPercent, getCategory } = useProgress()
const { pickQuestions, modeLabels } = useQuizPool()

const activeTab = ref('learn')
const activeLesson = ref(0)
const showQuiz = ref(false)
const quizQuestions = ref([])
const quizModeTitle = ref('')
const lessonNav = ref(null)
const lessonBtnRefs = ref({})

watch(categoryId, () => {
  activeLesson.value = 0
  activeTab.value = 'learn'
})

watch(category, (cat) => {
  if (!cat) return
  useHead({ title: `${cat.title} – Strojovođa` })
  if (activeLesson.value >= cat.lessons.length) {
    activeLesson.value = 0
  }
}, { immediate: true })

function lessonScriptNum(lesson) {
  const m = lesson?.title?.match(/^(\d+)\./)
  return m ? m[1] : null
}

function lessonLabel(_lesson, index) {
  return String(index + 1)
}

function scrollToActiveLesson() {
  nextTick(() => {
    const el = lessonBtnRefs.value[activeLesson.value]
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  })
}

watch(activeLesson, () => {
  if (category.value) markLessonRead(category.value.id, activeLesson.value)
  scrollToActiveLesson()
})

watch(activeTab, (tab) => {
  if (tab === 'learn') scrollToActiveLesson()
})

onMounted(scrollToActiveLesson)

function goToFirstLesson() {
  activeLesson.value = 0
}

function goToLastLesson() {
  if (category.value?.lessons?.length) {
    activeLesson.value = category.value.lessons.length - 1
  }
}

function setLessonBtnRef(el, index) {
  if (el) lessonBtnRefs.value[index] = el
}

const progressPct = computed(() => categoryPercent(category.value))

const tabs = [
  { id: 'learn', label: 'Uči', icon: '📖' },
  { id: 'signals', label: 'Signali', icon: '🚦' },
  { id: 'flash', label: 'Kartice', icon: '🃏' },
  { id: 'quiz', label: 'Kviz', icon: '🎯' },
]

function onSignalSeen(index) {
  if (category.value) markSignalSeen(category.value.id, index)
}

function startQuiz(mode) {
  if (!category.value?.quiz?.length) return
  const meta = modeLabels[mode] || modeLabels.mixed
  const count = meta.count === 999 ? category.value.quiz.length : meta.count
  quizQuestions.value = pickQuestions(category.value, mode, count)
  quizModeTitle.value = meta.title
  showQuiz.value = true
}

function onQuizFinished({ score, total }) {
  if (category.value) recordQuiz(category.value.id, score, total)
}

function closeQuiz() {
  showQuiz.value = false
}

const quizStats = computed(() => {
  if (!category.value?.quiz) return { exam: 0, signal: 0, theory: 0 }
  const q = category.value.quiz
  return {
    exam: q.filter(x => x.type === 'exam').length,
    signal: q.filter(x => x.type === 'signal').length,
    theory: q.filter(x => x.type === 'theory').length,
  }
})

const catProgress = computed(() => category.value ? getCategory(category.value.id) : null)
</script>

<template>
  <div v-if="category" class="min-h-screen bg-neutral-950 pb-28">
    <header class="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3 mb-3">
          <NuxtLink to="/" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" aria-label="Natrag">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-cyan-400/70">{{ category.icon }} {{ progressPct }}% savladano</p>
            <h1 class="text-lg font-bold text-white truncate">{{ category.title }}</h1>
          </div>
        </div>

        <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all" :style="{ width: `${progressPct}%` }" />
        </div>

        <nav class="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            :class="activeTab === tab.id
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'"
            @click="activeTab = tab.id"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </nav>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- UČI -->
      <section v-show="activeTab === 'learn'" class="space-y-4">
        <p class="text-slate-400 text-sm leading-relaxed">{{ category.description }}</p>

        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs text-slate-500">
              Lekcija {{ activeLesson + 1 }} / {{ category.lessons.length }}
              <span
                v-if="lessonScriptNum(category.lessons[activeLesson])"
                class="text-slate-600"
              >
                · točka {{ lessonScriptNum(category.lessons[activeLesson]) }} u skripti
              </span>
            </p>
            <div class="flex gap-1 shrink-0">
              <button
                type="button"
                class="w-8 h-8 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/50 disabled:opacity-30"
                :disabled="activeLesson === 0"
                title="Prva lekcija"
                @click="goToFirstLesson"
              >
                ⏮
              </button>
              <button
                type="button"
                class="w-8 h-8 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/50 disabled:opacity-30"
                :disabled="activeLesson >= category.lessons.length - 1"
                title="Zadnja lekcija"
                @click="goToLastLesson"
              >
                ⏭
              </button>
            </div>
          </div>
          <div
            ref="lessonNav"
            class="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory"
            style="-webkit-overflow-scrolling: touch"
          >
            <button
              v-for="(lesson, i) in category.lessons"
              :key="i"
              :ref="el => setLessonBtnRef(el, i)"
              type="button"
              class="shrink-0 min-w-[2.25rem] h-9 px-1.5 rounded-lg text-xs font-bold transition-colors snap-center"
              :class="activeLesson === i
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                : (catProgress?.lessonsRead?.includes(i) ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50' : 'bg-slate-800 text-slate-400 border border-slate-700')"
              :title="lesson.title"
              @click="activeLesson = i"
            >
              {{ lessonLabel(lesson, i) }}
            </button>
          </div>
        </div>

        <div class="card-dark p-5">
          <h3 class="text-base font-semibold text-white mb-4 leading-snug break-words">
            {{ category.lessons[activeLesson]?.title }}
          </h3>
          <LessonContent :lesson="category.lessons[activeLesson]" />
          <div class="flex justify-between mt-5 pt-4 border-t border-slate-700/50">
            <button type="button" class="btn-secondary text-sm py-2 px-3" :disabled="activeLesson === 0" @click="activeLesson--">← Prethodna</button>
            <button type="button" class="btn-secondary text-sm py-2 px-3" :disabled="activeLesson >= category.lessons.length - 1" @click="activeLesson++">Sljedeća →</button>
          </div>
        </div>
      </section>

      <!-- SIGNALI -->
      <section v-show="activeTab === 'signals'" class="space-y-4">
        <p class="text-sm text-slate-400">{{ category.signals.length }} signala iz skripte – vizualizacija i opis.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <article
            v-for="(signal, i) in category.signals"
            :key="i"
            class="card-dark overflow-hidden"
          >
            <div class="bg-slate-950 border-b border-slate-800">
              <SignalVisual :visual="signal.visual" :alt="signal.name" />
            </div>
            <div class="p-4">
              <h3 class="text-sm font-semibold text-cyan-300 mb-2">{{ signal.name }}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">{{ signal.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- FLASH KARTICE -->
      <section v-show="activeTab === 'flash'">
        <p class="text-sm text-slate-400 mb-4">Pogodi značenje signala prije nego okreneš karticu.</p>
        <SignalFlashcard v-if="category.signals.length" :signals="category.signals" @seen="onSignalSeen" />
        <p v-else class="text-slate-500 text-center py-12">Nema signala u ovoj kategoriji.</p>
      </section>

      <!-- KVIZ -->
      <section v-show="activeTab === 'quiz'" class="space-y-4">
        <div class="card-dark p-4 border-cyan-500/20">
          <p class="font-semibold text-white mb-2">Odaberi način vježbanja</p>
          <p class="text-xs text-slate-400 mb-3">
            {{ category.quiz.length }} pitanja ukupno ·
            {{ quizStats.exam }} ispitnih ·
            {{ quizStats.signal }} signala ·
            {{ quizStats.theory }} teorije
          </p>
          <p v-if="catProgress?.quizBest" class="text-xs text-emerald-400">
            Tvoj rekord: {{ catProgress.quizBest }}%
            <span v-if="catProgress.streak"> · niz {{ catProgress.streak }} 🔥</span>
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="(meta, mode) in modeLabels"
            :key="mode"
            type="button"
            class="card-dark p-4 text-left hover:border-cyan-500/40 transition-all group"
            @click="startQuiz(mode)"
          >
            <span class="text-2xl mb-2 block group-hover:scale-110 transition-transform">{{ meta.icon }}</span>
            <p class="font-semibold text-white text-sm">{{ meta.title }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ meta.desc }}</p>
            <p class="text-xs text-cyan-500/80 mt-2">
              {{ meta.count === 999 ? category.quiz.length : Math.min(meta.count, category.quiz.length) }} pitanja
            </p>
          </button>
        </div>
      </section>
    </main>

    <QuizModal
      v-if="showQuiz"
      :questions="quizQuestions"
      :category-title="category.title"
      :mode-title="quizModeTitle"
      @close="closeQuiz"
      @finished="onQuizFinished"
    />
  </div>

  <div v-else class="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-6xl mb-4">🚧</p>
      <h1 class="text-xl font-bold text-white mb-2">Kategorija nije pronađena</h1>
      <NuxtLink to="/" class="btn-primary mt-4 inline-flex">Natrag</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
