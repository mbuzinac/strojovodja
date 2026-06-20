<script setup>
defineProps({
  item: { type: Object, required: true },
  showCategory: { type: Boolean, default: false },
})

const assetPath = useAssetPath()

function onImgError(e) {
  if (e?.target) e.target.style.visibility = 'hidden'
}
</script>

<template>
  <article class="card-dark overflow-hidden h-full flex flex-col">
    <!-- SIGNAL -->
    <template v-if="item.type === 'signal'">
      <div
        v-if="item.images?.length"
        class="bg-slate-950 border-b border-slate-800 px-3 py-4"
      >
        <div class="flex flex-wrap items-start justify-center gap-5">
          <figure
            v-for="(img, idx) in item.images"
            :key="idx"
            class="flex flex-col items-center gap-1.5 max-w-[170px]"
          >
            <img
              :src="assetPath(img.image)"
              :alt="item.name"
              loading="lazy"
              class="max-h-32 max-w-[150px] object-contain rounded-md bg-white/5 p-1"
              @error="onImgError"
            />
            <figcaption
              v-if="img.label"
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-400 text-center"
            >
              {{ img.label }}
            </figcaption>
            <figcaption
              v-if="img.desc"
              class="text-[10px] text-slate-500 text-center leading-snug break-words"
            >
              {{ img.desc }}
            </figcaption>
          </figure>
        </div>
      </div>
      <div class="p-4 flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="text-sm font-semibold text-cyan-300 leading-snug break-words min-w-0">
            {{ item.name }}
          </h3>
          <span v-if="showCategory" class="text-base shrink-0 leading-none mt-0.5">{{ item.categoryIcon }}</span>
        </div>
        <p v-if="item.group" class="text-[10px] text-slate-600 mb-2">
          <span v-if="showCategory">{{ item.categoryTitle }} · </span>{{ item.group }}
        </p>
        <p
          v-if="item.description"
          class="text-xs text-slate-400 leading-relaxed whitespace-pre-line break-words"
        >
          {{ item.description }}
        </p>
      </div>
    </template>

    <!-- DEFINICIJA -->
    <template v-else-if="item.type === 'definition'">
      <div class="p-4 flex-1 min-w-0">
        <div class="flex items-start gap-2 mb-1.5">
          <span class="text-base shrink-0 leading-none mt-0.5">📖</span>
          <h3 class="text-sm font-semibold text-white leading-snug break-words min-w-0">{{ item.term }}</h3>
        </div>
        <p v-if="item.text" class="text-xs text-slate-300 leading-relaxed break-words">{{ item.text }}</p>
        <p
          v-if="item.description"
          class="text-xs text-slate-400 leading-relaxed whitespace-pre-line break-words mt-1.5"
        >
          {{ item.description }}
        </p>
        <p v-if="showCategory" class="text-[10px] text-slate-600 mt-2">{{ item.categoryTitle }}</p>
      </div>
    </template>

    <!-- PITANJE / ODGOVOR -->
    <template v-else-if="item.type === 'qa'">
      <div class="p-4 flex-1 min-w-0">
        <div class="flex items-start gap-2 mb-2">
          <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0 leading-none">
            PITANJE
          </span>
          <h3 class="text-sm font-semibold text-white leading-snug break-words min-w-0">{{ item.question }}</h3>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-line break-words">{{ item.answer }}</p>
      </div>
    </template>

    <!-- NAPOMENA -->
    <template v-else>
      <div class="p-4 flex-1 min-w-0 border-l-2 border-cyan-500/30 bg-cyan-500/5">
        <p class="text-xs text-cyan-100/80 leading-relaxed whitespace-pre-line break-words">{{ item.text }}</p>
        <p v-if="item.group" class="text-[10px] text-slate-600 mt-2">{{ item.group }}</p>
      </div>
    </template>
  </article>
</template>
