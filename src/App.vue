<script setup lang="ts">
import Content from "@/frames/Content.vue";
import Frames from "./components/Frames.vue";
import { onMounted } from "vue";
import { Player } from "@/store/player";
import { useDebounceFn } from "@vueuse/core";
import { useCoreStore } from "./store/coreStore";

const coreStore = useCoreStore();
const player = new Player();

function exportToPDF() {
  window.print();
}

function autoRescale() {
  const w = coreStore.frameWidth;
  const h = coreStore.frameHeight;
  let s = 1;

  if (document.fullscreenElement) {
    // fullscreen mode
    const W = window.screen.width;
    const H = window.screen.height;
    s = Math.min(W / w, H / h);
  } else {
    // normal mode
    const m = 8;
    const W = document.body.clientWidth;
    const d = Math.max(0, Math.min(W - 2 * m, 2 * m));
    s = Math.min(W - d, w) / w;
  }

  coreStore.frameScale = s;
  document.documentElement.style.setProperty("--frame-scale", s.toString());
}

function injectPrintSize() {
  // remove previous block if you call this more than once
  const old = document.getElementById("dynamic-print-style");
  if (old) old.remove();

  const style = document.createElement("style");
  style.id = "dynamic-print-style";
  style.textContent = `
@media print {
  @page {
    size: ${coreStore.frameWidthCm}cm ${coreStore.frameHeightCm}cm;
  }
}`;

  document.head.appendChild(style);
}

const safeAutoRescale = useDebounceFn(autoRescale, 50);
window.addEventListener("resize", safeAutoRescale);
document.addEventListener("fullscreenchange", safeAutoRescale);
onMounted(() => {
  injectPrintSize();
  autoRescale();
});
</script>

<template>
  <div class="bg-gray-100 min-h-[100vh] print:min-h-auto">
    <div class="text-center p-8 space-x-8 print:hidden">
      <button class="btn" @click="exportToPDF">Export to PDF</button>
      <button
        class="btn"
        @click="player.start()"
        v-if="coreStore.canFullscreen"
        v-text="'Play the slideshow'"
      />
    </div>
    <Frames>
      <Content />
    </Frames>
  </div>
</template>
