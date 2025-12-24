<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    author?: string;
    year?: string;
    etal?: boolean;
    list?: Array<[string, string, boolean?]>;
  }>(),
  {
    etal: true,
  },
);

function toHtml(author: string, year: string, etal: boolean = true) {
  return `${author}${etal ? " <i>et al.</i>" : ""}, ${year}`;
}

const html = computed(() => {
  let inner = "";

  if (props.list) {
    inner = props.list
      .map(([author, year, etal]) => toHtml(author, year, etal))
      .join("; ");
  } else {
    inner = toHtml(props.author ?? "", props.year ?? "", props.etal);
  }

  return `[${inner}]`;
});
</script>

<template>
  <span class="text-xs text-blue-600" v-html="html" />
</template>
