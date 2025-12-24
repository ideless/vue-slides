<script setup lang="ts">
import katex from "katex";
import "katex/dist/katex.min.css";
import { Player } from "@/store/player";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useCoreStore } from "@/store/coreStore";

defineProps<{
  title?: string;
  noIndex?: boolean;
}>();

function renderInlineMath(text: string) {
  const parts = text.split(/(?<![\\])\$([^$]+)(?<![\\])\$/g);

  // parts: [text, math, text, math, …]
  for (let i = 1; i < parts.length; i += 2) {
    const math = parts[i].trim();
    try {
      parts[i] = katex.renderToString(math);
    } catch (err) {
      // Fallback: leave original if KaTeX throws
      parts[i] = `$${math}$`;
    }
  }

  // Re-join and un-escape escaped dollars
  return parts.join("").replace(/\\\$/g, "$");
}

const coreStore = useCoreStore();
const frameEl = ref<HTMLDivElement>();
const frameIndex = ref(0);
const frameCount = ref(0);
const player = new Player();

function updateFrameEls() {
  coreStore.frameEls = Array.from(document.querySelectorAll(".frame"));
}

function updateIndexAndCount() {
  if (!frameEl.value) return;
  frameIndex.value = coreStore.frameEls.indexOf(frameEl.value);
  frameCount.value = coreStore.frameEls.length;
}

onMounted(updateFrameEls);
onUnmounted(updateFrameEls);
watch(() => coreStore.frameEls, updateIndexAndCount);
</script>

<template>
  <div
    :style="{
      width: coreStore.frameVisualWidth + 'px',
      height: coreStore.frameVisualHeight + 'px',
    }"
    class="frame overflow-hidden shadow-md print:shadow-none"
    ref="frameEl"
  >
    <div
      :style="{
        width: coreStore.frameWidthCm + 'cm',
        height: coreStore.frameHeightCm + 'cm',
      }"
      class="frame-content relative flex flex-col bg-white origin-top-left"
    >
      <h1
        v-if="title"
        class="p-4 text-3xl font-bold text-center"
        v-html="renderInlineMath(title)"
      />
      <div class="flex-1 overflow-hidden px-8">
        <slot />
      </div>
      <div
        class="absolute bottom-0.5 right-1 text-xs scale-60 origin-bottom-right space-x-4 text-gray-400"
      >
        <button
          class="play-from-current font-sans btn hover:text-black"
          @click.stop="player.start(frameIndex)"
          v-text="'Play from current'"
          v-if="coreStore.canFullscreen"
        />
        <span
          class="font-mono"
          v-text="`${frameIndex + 1}/${frameCount}`"
          v-if="!noIndex"
        />
      </div>
    </div>
  </div>
</template>
