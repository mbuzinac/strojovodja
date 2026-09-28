<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  num: { type: Number, required: true },
  cat: { type: Object, default: null },
  revealAll: { type: Boolean, default: false },
  status: { default: null },
})

const assetPath = useAssetPath()
const open = ref(false)
const show = computed(() => open.value || props.revealAll)

function onImgError(e) {
  if (e?.target) e.target.style.visibility = 'hidden'
}
</script>

<template>
  <article class="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
    <div class="p-4">
      <div class="flex items-start gap-2.5 mb-2">
        <span class="shrink-0 mt-0.5 inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 rounded-lg bg-slate-800 text-xs font-bold text-cyan-300">
          {{ num }}
        </span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span v-if="cat" class="text-[10px] text-slate-500">{{ cat.icon }} {{ cat.title }}</span>
            <span v-if="item.group" class="text-[10px] text-slate-600">· {{ item.group }}</span>
            <span
              v-if="status === true"
              class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            >znam</span>
            <span
              v-else-if="status === false"
              class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30"
            >ponovi</span>
          </div>
          <h3 class="text-sm font-semibold text-white leading-snug whitespace-pre-line">
            {{ item.question }}
          </h3>
        </div>
      </div>

      <!-- Slike signala – vidljive i PRIJE odgovora (kao na usmenom) -->
      <div
        v-if="item.images?.length"
        class="mt-3 flex flex-wrap justify-center gap-3 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-3"
      >
        <img
          v-for="(src, i) in item.images"
          :key="i"
          :src="assetPath(src)"
          :alt="item.question"
          loading="lazy"
          class="max-h-28 max-w-[140px] object-contain rounded-md bg-white/5 p-1"
          @error="onImgError"
        />
      </div>

      <button
        v-if="!show"
        type="button"
        class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
        @click="open = true"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Prikaži odgovor
      </button>

      <div v-else class="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
        <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 mb-1">Odgovor</p>
        <p class="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{{ item.answer }}</p>
        <button
          v-if="!revealAll"
          type="button"
          class="mt-2 text-[11px] text-slate-500 hover:text-slate-300"
          @click="open = false"
        >
          Sakrij
        </button>
      </div>
    </div>
  </article>
</template>
