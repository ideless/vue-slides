<script setup lang="ts">
import Frame from "@/components/Frame.vue";
import Katex from "@/components/Katex.vue";
import Code from "@/components/Code.vue";
import Mermaid from "@/components/Mermaid.vue";
import Cite from "@/components/Cite.vue";
import Block from "@/components/Block.vue";
import { useCanvas } from "@/store/canvas";

const draw = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  reason: string,
  data?: any,
) => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw a background or grid if needed
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw a box at mouse position (if data exists) or at center
  const x = data?.x ?? canvas.width / 2;
  const y = data?.y ?? canvas.height / 2;

  ctx.fillStyle = "#ef4444"; // Tailwind red-500
  ctx.fillRect(x - 25, y - 25, 50, 50);

  ctx.fillStyle = "black";
  ctx.font = "16px serif";
  ctx.fillText(`Redraw reason: ${reason}`, 10, 20);
};

const { canvas, style, getMousePosition, redraw } = useCanvas(500, 240, draw);

function handleMouseMove(e: MouseEvent) {
  try {
    const pos = getMousePosition(e);
    redraw("mousemove", pos);
  } catch (err) {
    // Canvas might not be ready yet
  }
}
</script>

<template>
  <Frame no-index>
    <div
      class="h-full flex flex-col items-center justify-center gap-8 text-center"
    >
      <p class="text-4xl font-bold">Vue Slides</p>
      <p>
        <a href="https://github.com/ideless">ideless</a><br />
        <a href="mailto:pyjy@yahoo.com">pyjy@yahoo.com</a><br />
        <a href="https://github.com/ideless/vue-slides">
          https://github.com/ideless/vue-slides
        </a>
      </p>
    </div>
  </Frame>

  <Frame title="Features">
    <ul class="space-y-3 mt-6">
      <li>Play the slideshow with pauses and animations right in browser</li>
      <li>Export the slides to PDF</li>
      <li>
        Component library: <Code>Frame</Code>, <Code>Katex</Code>,
        <Code>Code</Code>, <Code>Mermaid</Code>, <Code>Cite</Code>,
        <Code>Block</Code>
      </li>
      <li>All HTML5 features, including dedicated support for canvas</li>
      <li>
        Pleasing writting experience, thanks to Vite, Vue, and Tailwind CSS
      </li>
    </ul>
  </Frame>

  <Frame title="Frame">
    <p>Basic usage:</p>
    <Code lang="html" class="text-sm">
      <pre>
        &lt;Frame title="The title of the frame"&gt;
          The content goes here
        &lt;/Frame&gt;
      </pre>
    </Code>
    <p class="mt-2">Props:</p>
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>title</td>
          <td>string</td>
          <td>No</td>
          <td>The heading of the frame</td>
        </tr>
        <tr>
          <td>noIndex</td>
          <td>boolean</td>
          <td>No</td>
          <td>If set, hide the frame number in the bottom-right corner</td>
        </tr>
      </tbody>
    </table>
  </Frame>

  <Frame title="Pause: how does it work">
    <p><b>Elements in a frame appear in the following sequence:</b></p>
    <ol>
      <li>Elements without the <Code>pause</Code> class appear immediately</li>
      <li>
        Elements with the class <Code>pause</Code>, with <Code>order</Code> 1 or
        undefined
      </li>
      <li>
        Elements with the class <Code>pause</Code>, with <Code>order</Code> 2,
        3, etc.
      </li>
    </ol>
    <p class="mt-2 pause anim-fade-1"><b>Available pause animations:</b></p>
    <ul class="pause anim-fade-1">
      <li><Code>anim-fade</Code>: fades from transparent to opaque</li>
      <li><Code>anim-fade-1</Code>: fades from semi-transparent to opaque</li>
    </ul>
    <p class="pause anim-fade-1">
      Animations <b>MUST</b> be used in combination with the
      <Code>pause</Code> class, otherwise the element still appears immediately
    </p>
  </Frame>

  <Frame title="Pause: example">
    <Code lang="html">
      <pre>
        &lt;element&gt;
          This appears immediately
        &lt;element&gt;
        &lt;element class=&quot;pause anim-fade-1&quot;&gt;
          This appears next
        &lt;element&gt;
        &lt;element class=&quot;pause anim-fade-1&quot; order=&quot;2&quot;&gt;
          This appears last
        &lt;element&gt;
      </pre>
    </Code>
  </Frame>

  <Frame title="Pause: shortcuts">
    <table>
      <thead>
        <tr>
          <th>Shortcut</th>
          <th>Function</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><kbd>→</kbd>, <kbd>↓</kbd>, <kbd>n</kbd>, <kbd>Space</kbd></td>
          <td>Next pause, or next frame if no pauses left</td>
        </tr>
        <tr>
          <td class="text-nowrap">
            <kbd>←</kbd>, <kbd>↑</kbd>, <kbd>p</kbd>, <kbd>Backspace</kbd>
          </td>
          <td>Previous pause, or previous frame if no pauses left</td>
        </tr>
        <tr>
          <td><kbd>PageDown</kbd>, <kbd>N</kbd></td>
          <td>Next full frame</td>
        </tr>
        <tr>
          <td><kbd>PageUp</kbd>, <kbd>P</kbd></td>
          <td>Previous full frame</td>
        </tr>
        <tr>
          <td><kbd>Home</kbd>, <kbd>h</kbd></td>
          <td>First frame</td>
        </tr>
        <tr>
          <td><kbd>End</kbd>, <kbd>e</kbd></td>
          <td>Last frame</td>
        </tr>
      </tbody>
    </table>
  </Frame>

  <Frame title="Katex: usage">
    <p>Inline:</p>
    <Code lang="html" class="text-xs">
      <pre>
        &lt;Katex&gt;A = B \otimes C&lt;/Katex&gt;
      </pre>
    </Code>
    <p>Result: <Katex>A = B \otimes C</Katex></p>
    <p>Block:</p>
    <Code lang="html" class="text-xs">
      <pre>
        &lt;Katex&gt;
          &lt;pre&gt; x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} &lt;/pre&gt;
        &lt;/Katex&gt;
      </pre>
    </Code>
    <p>Result:</p>
    <Katex>
      <pre>
        x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
      </pre>
    </Katex>
  </Frame>

  <Frame title="Katex: props">
    <table class="mt-12">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>fontSize</td>
          <td>string</td>
          <td>No</td>
          <td>Default to "1rem"</td>
        </tr>
        <tr>
          <td>margin</td>
          <td>string</td>
          <td>No</td>
          <td>Margin of the math blocks, default to "1em 0"</td>
        </tr>
      </tbody>
    </table>
  </Frame>

  <Frame title="Code: usage">
    <p>Inline:</p>
    <Code lang="html" class="text-xs">
      <pre>
        &lt;Code lang="python"&gt;lambda x: x**2&lt;/Code&gt;
      </pre>
    </Code>
    <p>Result: <Code lang="python">lambda x: x**2</Code></p>
    <p>Usage:</p>
    <Code lang="html" class="text-xs">
      <pre>
        &lt;Code lang=&quot;python&quot;&gt;
          &lt;pre&gt; def square(x: int): ... &lt;/pre&gt;
        &lt;/Code&gt;
      </pre>
    </Code>
    <p>Result:</p>
    <Code lang="python">
      <pre>
        def square(x: int): ...
      </pre>
    </Code>
  </Frame>

  <Frame title="Code: props">
    <table class="mt-6">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>lang</td>
          <td>string</td>
          <td>No</td>
          <td>Default to "text"</td>
        </tr>
      </tbody>
    </table>

    <p class="mt-6">
      Codes (e.g., html) may have to be escaped. An online tool for this:
      <a href="https://emn178.github.io/online-tools/html_encode.html">
        https://emn178.github.io/online-tools/html_encode.html
      </a>
    </p>
  </Frame>

  <Frame title="Mermaid">
    <p>Usage:</p>
    <Code lang="html" class="text-xs">
      <pre>
        &lt;Mermaid class=&quot;flex justify-center&quot;&gt;
          &lt;pre&gt;
            flowchart LR
              Start --&gt; Stop
          &lt;/pre&gt;
        &lt;/Mermaid&gt;
      </pre>
    </Code>
    <p>Result:</p>
    <Mermaid class="flex justify-center">
      <pre>
        flowchart LR
          Start --> Stop
      </pre>
    </Mermaid>
  </Frame>

  <Frame title="Cite">
    <p>Usage:</p>
    <Code lang="html" class="text-xs">
      <pre>
        &lt;Cite author=&quot;Vaswani&quot; year=&quot;2017&quot; /&gt;
        &lt;Cite :list=&quot;[[&#39;Feynman&#39;, &#39;1960&#39;, false], [&#39;Einstein&#39;, &#39;1940&#39;]]&quot; /&gt;
      </pre>
    </Code>
    <p>
      Result: <Cite author="Vaswani" year="2017" />,
      <Cite
        :list="[
          ['Feynman', '1960', false],
          ['Einstein', '1940'],
        ]"
      />
    </p>
    <table class="mt-2">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>author</td>
          <td>string</td>
          <td>No</td>
          <td>The author(s)</td>
        </tr>
        <tr>
          <td>year</td>
          <td>string</td>
          <td>No</td>
          <td>The year</td>
        </tr>
        <tr>
          <td>etal</td>
          <td>boolean</td>
          <td>No</td>
          <td>Shows <i>et al.</i>, default to true</td>
        </tr>
        <tr>
          <td>list</td>
          <td>Array</td>
          <td>No</td>
          <td>List of citations</td>
        </tr>
      </tbody>
    </table>
  </Frame>

  <Frame title="Block">
    <p>Usage:</p>
    <Code lang="html" class="text-sm">
      <pre>
        &lt;Block name=&quot;Theorem&quot;&gt;
          Any map can be colored using only four colors.
        &lt;/Block&gt;
      </pre>
    </Code>
    <p>Result:</p>
    <Block name="Theorem">
      Any map can be colored using only four colors.
    </Block>
    <table class="mt-2">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>name</td>
          <td>string</td>
          <td>Yes</td>
          <td>Block name</td>
        </tr>
      </tbody>
    </table>
  </Frame>

  <Frame title="Canvas: usage">
    <Code lang="html" class="text-xs h-11/12 overflow-y-auto">
      <pre>
        &lt;script setup&gt;
        import { useCanvas } from "@/store/canvas";

        function draw(ctx, canvas, reason, data) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw a box at mouse position (if data exists) or at center
          const x = data ? data.x : canvas.width / 2;
          const y = data ? data.y : canvas.height / 2;

          ctx.fillStyle = "#ef4444";
          ctx.fillRect(x - 25, y - 25, 50, 50);

          ctx.fillStyle = "black";
          ctx.font = "16px serif";
          ctx.fillText(`Redraw reason: ${reason}`, 10, 20);
        };

        const { canvas, style, getMousePosition, redraw } = useCanvas(500, 240, draw);

        function handleMouseMove(e) {
          try {
            const pos = getMousePosition(e);
            redraw("mousemove", pos);
          } catch (err) {
            // Canvas might not be ready yet
          }
        }
        &lt;/script&gt;

        &lt;template&gt;
          &lt;Frame title=&quot;Canvas&quot;&gt;
            &lt;canvas
              ref=&quot;canvas&quot;
              :style=&quot;style&quot;
              @mousemove=&quot;handleMouseMove&quot;
            /&gt;
          &lt;/Frame&gt;
        &lt;/template&gt;
      </pre>
    </Code>
  </Frame>

  <Frame title="Canvas: result">
    <div class="flex justify-center">
      <canvas
        ref="canvas"
        :style="style"
        @mousemove="handleMouseMove"
        class="border border-slate-300 shadow-lg bg-white cursor-none"
      />
    </div>
  </Frame>
</template>

<style>
table {
  background-color: var(--color-gray-50);
  border-radius: 8px;
  display: block;
  padding: 8px;
}
th,
td {
  text-align: left;
  padding: 4px 8px;
  line-height: 1;
}
</style>
