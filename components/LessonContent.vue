<script setup>
const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
})

const blocks = computed(() => {
  const raw = props.lesson?.blocks?.length
    ? props.lesson.blocks
    : props.lesson?.content
      ? props.lesson.content.split(/\n\n+/).filter(Boolean).map(text => ({
          type: text.startsWith('•') ? 'ul' : 'p',
          text: text.startsWith('•') ? undefined : text,
          items: text.startsWith('•') ? text.split('\n').map(l => l.replace(/^•\s*/, '')) : undefined,
        }))
      : []

  const filtered = raw.filter((b) => {
    if (b.type === 'image') return b.src
    if (b.type === 'item') return b.text?.trim()
    if (b.type === 'ul') return b.items?.length
    if (b.type === 'note' && /^Slika\s+\d/i.test(b.text?.trim())) return false
    return b.text?.trim()
  })

  if (filtered.length) return filtered

  if (props.lesson?.image) {
    return [{ type: 'image', src: props.lesson.image }]
  }
  return []
})

const hasInlineImages = computed(() => blocks.value.some(b => b.type === 'item' || b.type === 'image'))
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="lesson.image && !hasInlineImages"
      class="flex justify-center"
    >
      <img
        :src="lesson.image"
        :alt="lesson.title"
        class="max-h-48 rounded-lg border border-slate-700 bg-black/40 object-contain"
        loading="lazy"
      />
    </div>

    <template v-for="(block, i) in blocks" :key="i">
      <p
        v-if="block.type === 'p'"
        class="text-sm text-slate-300 leading-relaxed"
      >
        {{ block.text }}
      </p>

      <div
        v-else-if="block.type === 'item'"
        class="rounded-lg border border-slate-700/60 bg-slate-900/40 p-3 space-y-3"
      >
        <p class="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
          <span class="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/70" />
          <span>{{ block.text }}</span>
        </p>
        <img
          v-if="block.image"
          :src="block.image"
          :alt="block.text"
          class="max-h-44 w-full rounded-lg border border-slate-700 bg-black/50 object-contain mx-auto"
          loading="lazy"
        />
      </div>

      <ul
        v-else-if="block.type === 'ul'"
        class="space-y-2 pl-1"
      >
        <li
          v-for="(item, j) in block.items"
          :key="j"
          class="flex gap-2.5 text-sm text-slate-300 leading-relaxed"
        >
          <span class="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/70" />
          <span>{{ item }}</span>
        </li>
      </ul>

      <div
        v-else-if="block.type === 'image'"
        class="flex justify-center"
      >
        <img
          :src="block.src"
          :alt="lesson.title"
          class="max-h-44 rounded-lg border border-slate-700 bg-black/50 object-contain"
          loading="lazy"
        />
      </div>

      <div
        v-else-if="block.type === 'note'"
        class="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3"
      >
        <p class="text-sm text-cyan-100/90 leading-relaxed">{{ block.text }}</p>
      </div>
    </template>
  </div>
</template>
