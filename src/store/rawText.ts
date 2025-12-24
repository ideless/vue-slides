import { useSlots, computed, ref, onMounted, watch } from "vue";

function trimCommonIndent(text: string) {
  const lines = text.split(/\r?\n/);

  // Find the minimum indentation among non-empty lines
  let minIndent = Infinity;
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.length === 0) continue; // skip empty/whitespace-only
    const indent = line.length - trimmed.length; // number of leading spaces
    if (indent < minIndent) minIndent = indent;
  }

  // If every line was empty or there was no leading space anywhere
  if (minIndent === Infinity || minIndent === 0) return text;

  // Remove exactly `minIndent` spaces from each line
  return lines
    .map((line) =>
      line.slice(Math.min(minIndent, line.length - line.trimStart().length)),
    )
    .join("\n");
}

export function useRawText() {
  const slots = useSlots();
  const raw = computed(() => {
    let text = "";
    let block = false;

    if (slots.default) {
      const slot = slots.default()[0];

      text = trimCommonIndent(String(slot.children));
      block = slot.type == "pre";
    }

    // console.debug({ text, block });

    return { text, block };
  });

  return raw;
}

export function useRawTextRender(
  fn: (text: string, block: boolean, el: HTMLElement) => void,
) {
  const el = ref<HTMLElement>();
  const raw = useRawText();

  const render = () => {
    if (!el.value) return;

    try {
      fn(raw.value.text, raw.value.block, el.value);
    } catch (e) {
      console.error(e);
      el.value.innerHTML = `<pre class="text-red-500 text-wrap">${e}</pre>`;
    }
  };

  onMounted(render);
  watch(raw, render);

  return { el, raw };
}
