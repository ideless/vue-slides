import { useCoreStore } from "@/store/coreStore";
import { ref, watch, onMounted } from "vue";

export function useCanvas(
  logicWidth: number,
  logicHeight: number,
  draw: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    reason: string,
    data?: any,
  ) => void,
) {
  const coreStore = useCoreStore();

  const canvas = ref<HTMLCanvasElement>();
  const style = `width: ${logicWidth}px; height: ${logicHeight}px`;
  let context: CanvasRenderingContext2D | null = null;

  function getMousePosition(e: MouseEvent) {
    if (!canvas.value) {
      throw new Error("No canvas");
    }

    const rect = canvas.value.getBoundingClientRect();

    return {
      x: ((e.clientX - rect.left) / rect.width) * logicWidth,
      y: ((e.clientY - rect.top) / rect.height) * logicHeight,
    };
  }

  function redraw(reason: string, data?: any) {
    if (!canvas.value || !context) {
      throw new Error("No canvas or context");
    }
    draw(context, canvas.value, reason, data);
  }

  function setGeometryAndDraw(reason: string) {
    if (!canvas.value || !context) return;

    const s = coreStore.frameScale * window.devicePixelRatio;

    canvas.value.width = logicWidth * s;
    canvas.value.height = logicHeight * s;

    context.setTransform(s, 0, 0, s, 0, 0);
    draw(context, canvas.value, reason);
  }

  watch(
    () => coreStore.frameScale,
    () => setGeometryAndDraw("rescale"),
  );

  onMounted(() => {
    if (canvas.value) {
      context = canvas.value.getContext("2d");
      setGeometryAndDraw("mount");
    } else {
      console.warn("No canvas");
    }
  });

  return {
    canvas,
    style,
    getMousePosition,
    redraw,
  };
}
