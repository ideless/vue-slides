<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="border-2 px-1 py-0.5">
    <b>{{ name }}.</b>
    <slot />
  </div>
</template>

<style scoped>
:deep(.katex-display) {
  margin: 4px 0 !important;
}
</style>
