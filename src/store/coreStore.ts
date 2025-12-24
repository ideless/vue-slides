import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCoreStore = defineStore("core", () => {
  const frameScale = ref(1);
  const frameWidthCm = 16;
  const frameHeightCm = 9;
  const frameWidth = frameWidthCm * (96 / 2.54); // px
  const frameHeight = frameHeightCm * (96 / 2.54); // px
  const frameVisualWidth = computed(() => frameWidth * frameScale.value);
  const frameVisualHeight = computed(() => frameHeight * frameScale.value);
  const frameEls = ref<Array<HTMLDivElement>>([]);
  const canFullscreen = document.fullscreenEnabled ?? false;

  return {
    frameScale,
    frameWidthCm,
    frameHeightCm,
    frameWidth,
    frameHeight,
    frameVisualWidth,
    frameVisualHeight,
    frameEls,
    canFullscreen,
  };
});
