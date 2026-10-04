<script setup>
import { buildQuizForItem } from '~/data/agencija-quiz.js'

const props = defineProps({
  item: { type: Object, required: true },
  pool: { type: Array, default: () => [] },
  num: { type: Number, default: 1 },
  total: { type: Number, default: 1 },
  cat: { type: Object, default: null },
  status: { default: null },
})

const emit = defineEmits(['mark', 'next', 'prev', 'zoom'])

const { theme } = useTheme()
const light = computed(() => theme.value === 'light')

const assetPath = useAssetPath()
const chosen = ref(null)
const showDetail = ref(false)

const quiz = computed(() => buildQuizForItem(props.item, props.pool))
const letters = ['A', 'B', 'C', 'D']

const isCorrect = computed(() =>
  chosen.value != null && quiz.value && chosen.value === quiz.value.correctIndex
)

/** Za usmeno: naziv → znači → radiš (posebno signali / likovni) */
const oral = computed(() => {
  const a = String(props.item?.answer || '')
  const name = props.item?.name
    || a.match(/Naziv:\s*„([^”"]+)"/i)?.[1]
    || a.match(/📛\s*„([^”"]+)"/)?.[1]
  const meaning = a.match(/Što znači:\s*\n?([^\n]+)/i)?.[1]?.trim()
  const actionMatch = a.match(/Što radiš:\s*\n?([\s\S]*?)(?=\n\s*✅|\n\s*Usmeno:|\n\s*📛|\n\s*👁|\n\s*💡|\n*$)/i)
  const actionLine = a.match(/🚂\s*Ti:\s*([^\n]+)/i)?.[1]?.trim()
  const action = (actionMatch?.[1] || actionLine || '').trim()
  const say = a.match(/Usmeno reci:\s*\n?([^\n]+)/i)?.[1]?.trim()
    || a.match(/Usmeno:\s*([^\n]+)/i)?.[1]?.trim()
  if (!meaning && !action && !say) return null
  return { name, meaning, action, say }
})

/** Samo dodatni dijelovi (izgled/napomene) – bez ponavljanja oral bloka */
const extraAnswer = computed(() => {
  if (!oral.value) return props.item?.answer || ''
  const a = String(props.item?.answer || '')
  const look = a.match(/👁[^\n]*\n?([\s\S]*?)(?=\n\s*💡|\n\s*🚂|\n\s*✅|\n*$)/)?.[1]?.trim()
  const nameBlock = a.match(/📛[^\n]+/)?.[0]
  const bits = []
  if (nameBlock && props.item?.kind === 'signal') bits.push(nameBlock)
  if (look) bits.push(`👁 Kako izgleda:\n${look}`)
  return bits.join('\n\n').trim()
})

const hasExtra = computed(() => extraAnswer.value.length > 20)

watch(() => props.item?.id, () => {
  chosen.value = null
  showDetail.value = false
})

function pick(i) {
  if (chosen.value != null || !quiz.value) return
  chosen.value = i
  const ok = i === quiz.value.correctIndex
  emit('mark', ok)
  // Ako nema oral kartice, odmah pokaži cijeli odgovor; inače samo oral (bez duplikata)
  showDetail.value = ok && !oral.value
}

function optionClass(i) {
  if (chosen.value == null) {
    return light.value
      ? 'border-slate-300 bg-white text-slate-900 hover:border-amber-500 hover:bg-amber-50 shadow-sm'
      : 'border-slate-600 bg-slate-900/80 text-slate-100 hover:border-amber-400/50 hover:bg-slate-800'
  }
  const correct = quiz.value?.correctIndex
  if (i === correct) {
    return light.value
      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/50'
      : 'border-emerald-400/70 bg-emerald-500/20 text-emerald-50 ring-2 ring-emerald-400/40'
  }
  if (i === chosen.value && i !== correct) {
    return light.value
      ? 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-400/40'
      : 'border-rose-400/70 bg-rose-500/20 text-rose-100'
  }
  return light.value
    ? 'border-slate-200 bg-slate-50 text-slate-500'
    : 'border-slate-800 bg-slate-950/50 text-slate-500 opacity-50'
}

function letterClass(i) {
  if (chosen.value != null && i === quiz.value?.correctIndex) {
    return light.value
      ? 'bg-emerald-600 text-white'
      : 'bg-emerald-400 text-emerald-950'
  }
  if (chosen.value === i && i !== quiz.value?.correctIndex) {
    return light.value
      ? 'bg-rose-600 text-white'
      : 'bg-rose-400 text-rose-950'
  }
  return light.value
    ? 'bg-amber-100 text-amber-900 border border-amber-300'
    : 'bg-amber-500/20 text-amber-300'
}

function onImgError(e) {
  if (e?.target) e.target.style.visibility = 'hidden'
}

function onKey(e) {
  if (!quiz.value) return
  const map = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3, 1: 0, 2: 1, 3: 2, 4: 3 }
  if (chosen.value == null && map[e.key] != null) {
    e.preventDefault()
    pick(map[e.key])
    return
  }
  if (e.key === 'Enter' || e.key === ' ') {
    if (chosen.value != null) {
      e.preventDefault()
      if (hasExtra.value && !showDetail.value) showDetail.value = true
      else if (!oral.value && !showDetail.value) showDetail.value = true
      else emit('next')
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="space-y-4 quiz-root" :data-quiz-theme="theme">
    <div
      class="overflow-hidden rounded-2xl border shadow-lg"
      :class="light
        ? 'border-amber-400 bg-white shadow-amber-900/10'
        : 'border-amber-500/20 bg-gradient-to-br from-slate-900 via-neutral-950 to-amber-950/20 shadow-amber-950/30'"
    >
      <div
        class="flex items-center gap-2 border-b px-4 py-3"
        :class="light ? 'border-slate-200 bg-amber-50' : 'border-slate-800/80'"
      >
        <span class="text-lg">💰</span>
        <span
          class="text-xs font-semibold uppercase tracking-wider"
          :class="light ? 'text-amber-800' : 'text-amber-400/90'"
        >Milijunaš</span>
        <span v-if="cat" class="text-xs" :class="light ? 'text-slate-600' : 'text-slate-500'">
          · {{ cat.icon }} {{ cat.title }}
        </span>
        <span
          v-if="status === true"
          class="rounded-md border px-1.5 py-0.5 text-[10px]"
          :class="light
            ? 'border-emerald-600 bg-emerald-100 text-emerald-800'
            : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'"
        >znam</span>
        <span
          v-else-if="status === false"
          class="rounded-md border px-1.5 py-0.5 text-[10px]"
          :class="light
            ? 'border-rose-600 bg-rose-100 text-rose-800'
            : 'border-rose-500/30 bg-rose-500/15 text-rose-400'"
        >ponovi</span>
        <span class="ml-auto font-mono text-xs" :class="light ? 'text-slate-600' : 'text-slate-500'">
          {{ num }} / {{ total }}
        </span>
      </div>

      <div class="p-5 sm:p-7" :class="light ? 'bg-white' : ''">
        <p v-if="item.group" class="mb-1 text-[11px]" :class="light ? 'text-slate-600' : 'text-slate-500'">
          {{ item.group }}
        </p>
        <p
          v-if="item.name"
          class="mb-1 text-sm"
          :class="light ? 'text-cyan-800 font-medium' : 'text-cyan-400/90'"
        >„{{ item.name }}"</p>
        <h2
          class="whitespace-pre-line text-lg font-semibold leading-snug sm:text-xl"
          :class="light ? 'text-slate-900' : 'text-white'"
        >
          {{ item.question }}
        </h2>

        <div
          v-if="item.images?.length"
          class="mt-5 flex flex-wrap justify-center gap-4 rounded-xl border px-4 py-5"
          :class="light ? 'border-amber-300 bg-slate-50' : 'border-amber-500/15 bg-slate-950/80'"
        >
          <figure
            v-for="(src, i) in item.images"
            :key="i"
            class="flex cursor-zoom-in flex-col items-center gap-1.5"
            @click="emit('zoom', src, item.imageLabels?.[i] || item.name || '')"
          >
            <figcaption
              v-if="item.imageLabels?.[i]"
              class="text-[10px] font-bold uppercase tracking-wider"
              :class="light ? 'text-amber-800' : 'text-amber-400'"
            >
              {{ item.imageLabels[i] }}
            </figcaption>
            <img
              :src="assetPath(src)"
              :alt="item.imageLabels?.[i] || item.name || ''"
              class="max-h-44 max-w-[180px] rounded-md object-contain p-2 sm:max-h-56 sm:max-w-[220px]"
              :class="light ? 'bg-white border border-slate-200' : 'bg-white/5'"
              @error="onImgError"
            />
          </figure>
        </div>

        <p
          v-if="!quiz"
          class="mt-6 rounded-xl border px-4 py-3 text-sm"
          :class="light ? 'border-slate-300 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-900/60 text-slate-400'"
        >
          Za ovo pitanje nema 4 ponuđena odgovora — prebaci na način Kartica.
        </p>

        <div v-else class="mt-6 grid gap-3">
          <button
            v-for="(opt, i) in quiz.options"
            :key="i"
            type="button"
            class="flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all disabled:cursor-default"
            :class="optionClass(i)"
            :disabled="chosen != null"
            @click="pick(i)"
          >
            <span
              class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
              :class="letterClass(i)"
            >{{ letters[i] }}</span>
            <span class="flex-1 leading-snug pt-0.5">{{ opt }}</span>
            <span
              v-if="chosen != null && i === quiz.correctIndex"
              class="shrink-0"
              :class="light ? 'text-emerald-700' : 'text-emerald-300'"
            >✓</span>
            <span
              v-else-if="chosen === i"
              class="shrink-0"
              :class="light ? 'text-rose-700' : 'text-rose-300'"
            >✗</span>
          </button>
        </div>

        <div v-if="chosen != null && quiz" class="mt-5 space-y-3">
          <div
            class="rounded-xl border px-4 py-3 text-sm font-semibold"
            :class="isCorrect
              ? (light ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200')
              : (light ? 'border-rose-600 bg-rose-50 text-rose-900' : 'border-rose-500/40 bg-rose-500/15 text-rose-200')"
          >
            <template v-if="isCorrect">Točno!</template>
            <template v-else>
              Netočno. Točno je
              <span :class="light ? 'text-emerald-800' : 'text-emerald-300'">{{ letters[quiz.correctIndex] }}</span>
              — {{ quiz.options[quiz.correctIndex] }}
            </template>
          </div>

          <!-- Ključ za usmeno: značenje + što radiš -->
          <div
            v-if="oral"
            class="rounded-xl border px-4 py-4 space-y-3"
            :class="light
              ? 'border-teal-600 bg-teal-50'
              : 'border-teal-500/35 bg-teal-500/10'"
          >
            <p
              class="text-[10px] font-bold uppercase tracking-wider"
              :class="light ? 'text-teal-800' : 'text-teal-300'"
            >Za usmeno – objasni ovako</p>
            <p v-if="oral.name" class="text-sm" :class="light ? 'text-slate-900' : 'text-slate-100'">
              <span class="font-semibold" :class="light ? 'text-cyan-800' : 'text-cyan-300'">Naziv:</span>
              „{{ oral.name }}"
            </p>
            <p v-if="oral.meaning" class="text-sm" :class="light ? 'text-slate-900' : 'text-slate-100'">
              <span class="font-semibold" :class="light ? 'text-amber-800' : 'text-amber-300'">Znači:</span>
              {{ oral.meaning }}
            </p>
            <p
              v-if="oral.action"
              class="text-sm font-semibold leading-snug rounded-lg border px-3 py-2.5"
              :class="light
                ? 'border-emerald-700 bg-emerald-100 text-emerald-950'
                : 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'"
            >
              <span class="block text-[10px] uppercase tracking-wider opacity-80 mb-1">Što radiš</span>
              {{ oral.action }}
            </p>
            <p
              v-if="oral.say"
              class="text-sm leading-snug"
              :class="light ? 'text-slate-800' : 'text-slate-200'"
            >
              <span class="font-semibold" :class="light ? 'text-violet-800' : 'text-violet-300'">Reci:</span>
              {{ oral.say }}
            </p>
          </div>

          <!-- Bez oral kartice: cijeli odgovor. S oral: samo izgled/napomene ako postoje. -->
          <template v-if="!oral">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition"
              :class="light
                ? 'border-cyan-600 bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'"
              @click="showDetail = !showDetail"
            >
              <span>{{ showDetail ? 'Sakrij odgovor' : 'Prikaži odgovor' }}</span>
              <span class="text-xs opacity-70">{{ showDetail ? '▲' : '▼' }}</span>
            </button>
            <div
              v-if="showDetail"
              class="rounded-xl border px-4 py-4"
              :class="light
                ? 'border-emerald-600 bg-emerald-50 text-slate-900'
                : 'border-emerald-500/20 bg-emerald-500/5'"
            >
              <AgencijaAnswer :text="item.answer" />
            </div>
          </template>
          <template v-else-if="hasExtra">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition"
              :class="light
                ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800'"
              @click="showDetail = !showDetail"
            >
              <span>{{ showDetail ? 'Sakrij izgled' : 'Kako izgleda / napomene' }}</span>
              <span class="text-xs opacity-70">{{ showDetail ? '▲' : '▼' }}</span>
            </button>
            <div
              v-if="showDetail"
              class="rounded-xl border px-4 py-4"
              :class="light
                ? 'border-slate-300 bg-slate-50 text-slate-900'
                : 'border-slate-700 bg-slate-950/50'"
            >
              <AgencijaAnswer :text="extraAnswer" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3">
      <button
        type="button"
        class="rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-30"
        :class="light
          ? 'border-slate-400 bg-white text-slate-800'
          : 'border-slate-700 text-slate-300'"
        :disabled="num <= 1"
        @click="emit('prev')"
      >
        ← Prethodno
      </button>
      <button
        type="button"
        class="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-30"
        :class="light
          ? 'border-amber-600 bg-amber-100 text-amber-950'
          : 'border-amber-500/40 bg-amber-500/15 text-amber-200'"
        :disabled="num >= total"
        @click="emit('next')"
      >
        {{ chosen != null ? 'Sljedeće →' : 'Preskoči →' }}
      </button>
    </div>

    <p class="text-center text-[11px]" :class="light ? 'text-slate-600' : 'text-slate-600'">
      Tipke A–D ili 1–4 · Enter = detalj / dalje
    </p>
  </div>
</template>
