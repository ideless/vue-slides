<script lang="ts" setup>
import { ref } from "vue";

const dot = ref<HTMLDivElement>();

document.addEventListener("mousemove", (e) => {
  if (!dot.value) return;
  dot.value.style.top = `${e.clientY}px`;
  dot.value.style.left = `${e.clientX}px`;
});
</script>

<template>
  <div id="frames" class="mx-auto w-fit space-y-1">
    <slot />
    <div ref="dot" id="cursor-dot" />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap");

#frames {
  font-family: "Newsreader", serif;
  /* font-optical-sizing: auto; */
  /* font-style: normal; */

  .frame-content {
    transform: scale(var(--frame-scale));
  }

  #cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 32px;
    height: 32px;
    background: radial-gradient(circle, red 0%, rgba(255, 0, 0, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    display: none;
    z-index: 100;
  }

  &.playing {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .frame {
      display: none;
      margin-block: unset;

      &.active {
        display: block;
      }
    }

    .pause.anim-fade {
      opacity: 0;
      transition: opacity 500ms ease;

      &.active {
        opacity: unset;
      }
    }

    .pause.anim-fade-1 {
      opacity: 0.1;
      transition: opacity 500ms ease;

      &.active {
        opacity: unset;
      }
    }

    .emph {
      transition: background-color 200ms ease;

      &:hover {
        background-color: #0002;
      }
    }

    #cursor-dot {
      display: block;
    }

    .play-from-current {
      display: none;
    }
  }
}

@media print {
  .frame {
    width: unset !important;
    height: unset !important;
  }

  .frame-content {
    transform: unset !important;
  }

  .play-from-current {
    display: none;
  }
}
</style>
