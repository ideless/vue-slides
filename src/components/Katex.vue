<script setup lang="ts">
import katex from "katex";
import "katex/dist/katex.min.css";
import { useRawTextRender } from "@/store/rawText";

withDefaults(
  defineProps<{
    fontSize?: string;
    margin?: string;
  }>(),
  {
    fontSize: "1rem",
    margin: "1em 0",
  },
);

const { el, raw } = useRawTextRender((text, block, el) => {
  katex.render(String(text), el, {
    displayMode: block,
    throwOnError: true,
  });
});
</script>

<template>
  <component
    :is="raw.block ? 'div' : 'span'"
    :class="{ 'inline-block': !raw.block }"
  >
    <span ref="el" />
  </component>
</template>

<style scoped>
:deep(.katex) {
  font-size: v-bind(fontSize) !important;
}
:deep(.katex-display) {
  margin: v-bind(margin) !important;
}
</style>
