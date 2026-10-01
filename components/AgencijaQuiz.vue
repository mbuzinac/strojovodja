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

const assetPath = useAssetPath()
const chosen = ref(null) // index
const showDetail = ref(false)

const quiz = computed(() => buildQuizForItem(props.item, props.pool))
const letters = ['A', 'B', 'C', 'D']

const isCorrect = computed(() =>
  chosen.value != null && quiz.value && chosen.value === quiz.value.correctIndex
)

watch(() => props.item?.id, () => {
  chosen.value = null
  showDetail.value = false
})

function pick(i) {
  if (chosen.value != null || !quiz.value) return
  chosen.value = i
  const ok = i === quiz.value.correctIndex
  emit('mark', ok)
  // auto-open detail on correct; on wrong keep collapsed until click
  if (ok) showDetail.value = true
}

function optionClass(i) {
  if (chosen.value == null) {
    return 'border-slate-600 bg-slate-900/80 text-slate-100 hover:border-amber-400/50 hover:bg-slate-800'
  }
  const correct = quiz.value?.correctIndex
  if (i === correct) {
    return 'border-emerald-400/70 bg-emerald-500/20 text-emerald-50 ring-2 ring-emerald-400/40'
  }
  if (i === chosen.value && i !== correct) {
    return 'border-rose-400/70 bg-rose-500/20 text-rose-100'
  }
  return 'border-slate-800 bg-slate-950/50 text-slate-500 opacity-50'
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
      if (!showDetail.value) showDetail.value = true
      else emit('next')
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="space-y-4">
    <div
      class="overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-neutral-950 to-amber-950/20 shadow-2xl shadow-amber-950/30"
    >
      <!-- header -->
      <div class="flex items-center gap-2 border-b border-slate-800/80 px-4 py-3">
        <span class="text-lg">💰</span>
        <span class="text-xs font-semibold uppercase tracking-wider text-amber-400/90">Milijunaš</span>
        <span v-if="cat" class="text-xs text-slate-500">· {{ cat.icon }} {{ cat.title }}</span>
        <span
          v-if="status === true"
          class="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-400"
        >znam</span>
        <span
          v-else-if="status === false"
          class="rounded-md border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-[10px] text-rose-400"
        >ponovi</span>
        <span class="ml-auto font-mono text-xs text-slate-500">{{ num }} / {{ total }}</span>
      </div>

      <div class="p-5 sm:p-7">
        <p v-if="item.group" class="mb-1 text-[11px] text-slate-500">{{ item.group }}</p>
        <p v-if="item.name" class="mb-1 text-sm text-cyan-400/90">„{{ item.name }}"</p>
        <h2 class="whitespace-pre-line text-lg font-semibold leading-snug text-white sm:text-xl">
          {{ item.question }}
        </h2>

        <!-- images -->
        <div
          v-if="item.images?.length"
          class="mt-5 flex flex-wrap justify-center gap-4 rounded-xl border border-amber-500/15 bg-slate-950/80 px-4 py-5"
        >
          <figure
            v-for="(src, i) in item.images"
            :key="i"
            class="flex cursor-zoom-in flex-col items-center gap-1.5"
            @click="emit('zoom', src, item.imageLabels?.[i] || item.name || '')"
          >
            <figcaption
              v-if="item.imageLabels?.[i]"
              class="text-[10px] font-bold uppercase tracking-wider text-amber-400"
            >
              {{ item.imageLabels[i] }}
            </figcaption>
            <img
              :src="assetPath(src)"
              :alt="item.imageLabels?.[i] || item.name || ''"
              class="max-h-44 max-w-[180px] rounded-md bg-white/5 object-contain p-2 sm:max-h-56 sm:max-w-[220px]"
              @error="onImgError"
            />
          </figure>
        </div>

        <p
          v-if="!quiz"
          class="mt-6 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-400"
        >
          Za ovo pitanje nema 4 ponuđena odgovora — prebaci na način Kartica.
        </p>

        <!-- A B C D -->
        <div v-else class="mt-6 grid gap-3">
          <button
            v-for="(opt, i) in quiz.options"
            :key="i"
            type="button"
            class="flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all disabled:cursor-default"
            :class="optionClass(i)"
            :disabled="chosen != null"
            @click="pick(i)"
          >
            <span
              class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
              :class="chosen != null && i === quiz.correctIndex
                ? 'bg-emerald-400 text-emerald-950'
                : chosen === i && i !== quiz.correctIndex
                  ? 'bg-rose-400 text-rose-950'
                  : 'bg-amber-500/20 text-amber-300'"
            >{{ letters[i] }}</span>
            <span class="flex-1 leading-snug pt-0.5">{{ opt }}</span>
            <span v-if="chosen != null && i === quiz.correctIndex" class="shrink-0 text-emerald-300">✓</span>
            <span v-else-if="chosen === i" class="shrink-0 text-rose-300">✗</span>
          </button>
        </div>

        <!-- feedback -->
        <div v-if="chosen != null && quiz" class="mt-5 space-y-3">
          <div
            class="rounded-xl border px-4 py-3 text-sm font-semibold"
            :class="isCorrect
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
              : 'border-rose-500/40 bg-rose-500/15 text-rose-200'"
          >
            <template v-if="isCorrect">Točno! 🎉</template>
            <template v-else>
              Netočno. Točno je
              <span class="text-emerald-300">{{ letters[quiz.correctIndex] }}</span>
              — {{ quiz.options[quiz.correctIndex] }}
            </template>
          </div>

          <button
            type="button"
            class="flex w-full items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
            @click="showDetail = !showDetail"
          >
            <span>{{ showDetail ? 'Sakrij detaljan odgovor' : 'Prikaži cijeli odgovor / objašnjenje' }}</span>
            <span class="text-xs opacity-70">{{ showDetail ? '▲' : '▼' }}</span>
          </button>

          <div
            v-if="showDetail"
            class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4"
          >
            <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Detaljno</p>
            <AgencijaAnswer :text="item.answer" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3">
      <button
        type="button"
        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 disabled:opacity-30"
        :disabled="num <= 1"
        @click="emit('prev')"
      >
        ← Prethodno
      </button>
      <button
        type="button"
        class="rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-200 disabled:opacity-30"
        :disabled="num >= total"
        @click="emit('next')"
      >
        {{ chosen != null ? 'Sljedeće →' : 'Preskoči →' }}
      </button>
    </div>

    <p class="text-center text-[11px] text-slate-600">
      Tipke A–D ili 1–4 · Enter = detalj / dalje
    </p>
  </div>
</template>
