<script setup lang="ts">
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { useRawTextRender } from "@/store/rawText";

const props = defineProps<{
  lang?: string;
}>();

const { el, raw } = useRawTextRender((text, _, el) => {
  el.innerHTML = hljs.highlight(text, {
    language: props.lang || "text",
  }).value;
});
</script>

<template>
  <component
    :is="raw.block ? 'div' : 'span'"
    :class="{
      'whitespace-pre-wrap px-4 py-2 bg-slate-50': raw.block,
      'px-1 rounded bg-slate-100 text-sm': !raw.block,
    }"
    class="font-mono"
  >
    <span ref="el" />
  </component>
</template>
