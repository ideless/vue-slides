<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import mermaid from "mermaid";
import { useRawText } from "@/store/rawText";

const mermaidElement = ref<HTMLSpanElement>();
const raw = useRawText();

const renderMermaid = async () => {
  if (!mermaidElement.value) return;

  const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });

    const { svg } = await mermaid.render(id, raw.value.text.trim());
    mermaidElement.value.innerHTML = svg;
  } catch (e) {
    console.error(e);
    mermaidElement.value.innerHTML = `<pre class="text-red-500 text-wrap">${e}</pre>`;

    // https://github.com/mermaid-js/mermaid/issues/4730
    // https://github.com/mermaid-js/mermaid-live-editor/pull/1288
    document.getElementById(`d${id}`)?.remove();
  }
};

onMounted(() => nextTick(renderMermaid));
watch(raw, () => nextTick(renderMermaid));
</script>

<template>
  <component
    :is="raw.block ? 'div' : 'span'"
    :class="{ 'inline-block': !raw.block }"
  >
    <span ref="mermaidElement" />
  </component>
</template>
