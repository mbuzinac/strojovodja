<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  revealAll: { type: Boolean, default: false },
})

const assetPath = useAssetPath()
const open = ref(false)
const picked = ref(null)

const show = computed(() => open.value || props.revealAll)
const letters = ['a', 'b', 'c', 'd', 'e', 'f']

function toggle() {
  open.value = !open.value
}

function pick(i) {
  picked.value = i
  open.value = true
}

function onImgError(e) {
  if (e?.target) e.target.style.visibility = 'hidden'
}
</script>

<template>
  <article class="card-dark overflow-hidden">
    <div class="p-4">
      <div class="flex items-start gap-2.5">
        <span class="shrink-0 mt-0.5 inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 rounded-lg bg-slate-800 text-xs font-bold text-cyan-300">
          {{ item.num }}
        </span>
        <h3 class="text-sm font-semibold text-white leading-snug whitespace-pre-line break-words flex-1 min-w-0">
          {{ item.question }}
        </h3>
      </div>

      <!-- slika (DIO 1) -->
      <div v-if="item.image" class="mt-3 flex justify-center">
        <img
          :src="assetPath(item.image)"
          :alt="item.question"
          loading="lazy"
          class="max-h-40 object-contain rounded-lg border border-slate-700 bg-white/5 p-1"
          @error="onImgError"
        />
      </div>

      <!-- VIŠESTRUKI IZBOR -->
      <div v-if="item.type === 'mc'" class="mt-3 space-y-2">
        <button
          v-for="(opt, i) in item.options"
          :key="i"
          type="button"
          class="w-full text-left flex gap-2.5 px-3 py-2 rounded-lg border text-xs leading-relaxed transition-colors"
          :class="[
            show && i === item.correctIndex
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
              : show && i === picked && i !== item.correctIndex
                ? 'border-rose-500/40 bg-rose-500/5 text-rose-200/80'
                : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600',
          ]"
          @click="pick(i)"
        >
          <span class="shrink-0 font-bold uppercase">{{ letters[i] }})</span>
          <span class="flex-1">{{ opt }}</span>
          <svg v-if="show && i === item.correctIndex" class="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <div v-if="show && item.explanation" class="flex items-start gap-2 mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <span v-if="item.source" class="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 leading-none mt-0.5">IZ GRADIVA</span>
          <p class="text-xs text-emerald-100/90 leading-relaxed">{{ item.explanation }}</p>
        </div>

        <button
          v-if="!show"
          type="button"
          class="text-xs font-medium text-cyan-400 hover:text-cyan-300"
          @click="toggle"
        >
          Prikaži točan odgovor
        </button>
      </div>

      <!-- OTVORENO PITANJE -->
      <div v-else class="mt-3">
        <button
          v-if="!show"
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
          @click="toggle"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Prikaži odgovor
        </button>

        <div v-else class="rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2.5">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Odgovor</span>
            <span v-if="item.source" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 leading-none">IZ GRADIVA</span>
          </div>
          <p class="text-xs text-slate-200 leading-relaxed whitespace-pre-line break-words">{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </article>
</template>
