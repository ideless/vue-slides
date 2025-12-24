# Vue Slides

A modern, developer-centric slideshow framework powered by **Vite**, **Vue**, and **Tailwind CSS**. Create high-quality presentations using Vue components with built-in support for LaTeX, diagrams, and interactive canvas elements.

[Demo](http://ideless.github.io/vue-slides)

## Features

- **Seamless Navigation**: Play slideshows with built-in support for pauses, animations, and intuitive keyboard shortcuts.
- **PDF Export**: Easily convert your web-based slides into professional PDF documents.
- **Rich Component Library**: Includes specialized components for academic and technical presentations: `Frame`, `Katex`, `Code`, `Mermaid`, `Cite`, and `Block`.
- **Full HTML5 & Canvas**: Leverage the full power of the modern web, including dedicated utilities for High-DPI canvas drawing.
- **Developer Experience**: Enjoy a smooth writing process with Hot Module Replacement (HMR) and Tailwind's utility-first styling.

## Pauses & Animations

Control the flow of information within a single frame.

**Logic Sequence:**

1. Elements without the `pause` class appear immediately.
2. Elements with `pause` and `order="1"` (or undefined) appear next.
3. Remaining `pause` elements appear sequentially according to their `order` (2, 3, etc.).

**Available Animations:**

- `anim-fade`: Fades from transparent to opaque.
- `anim-fade-1`: Fades from semi-transparent to opaque.

> **Note:** Animations **must** be used in combination with the `pause` class.

**Example:**

```html
<div>This appears immediately</div>
<div class="pause anim-fade">This appears next</div>
<div class="pause anim-fade-1" order="2">This appears last</div>
```

**Shortcuts:**

| Shortcut                   | Function                         |
| :------------------------- | :------------------------------- |
| `→`, `↓`, `n`, `Space`     | Next pause or next frame         |
| `←`, `↑`, `p`, `Backspace` | Previous pause or previous frame |
| `PageDown`, `N`            | Next full frame                  |
| `PageUp`, `P`              | Previous full frame              |
| `Home`, `h`                | Go to first frame                |
| `End`, `e`                 | Go to last frame                 |

## Components

### Frame

The building block of your presentation.

**Usage:**

```html
<frame title="The title of the frame"> The content goes here </frame>
```

**Props:**

| Prop      | Type    | Required | Description                                               |
| :-------- | :------ | :------- | :-------------------------------------------------------- |
| `title`   | string  | No       | The heading of the frame                                  |
| `noIndex` | boolean | No       | If set, hides the frame number in the bottom-right corner |

### Katex

Supports both inline and block math.

**Usage:**

```html
<!-- inline -->
<Katex>A = B \otimes C</Katex>

<!-- block -->
<Katex>
  <pre>x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}</pre>
</Katex>
```

**Props:**

| Prop       | Type   | Required | Description                                   |
| :--------- | :----- | :------- | :-------------------------------------------- |
| `fontSize` | string | No       | Default to "1rem"                             |
| `margin`   | string | No       | Margin of the math blocks, default to "1em 0" |

### Code

Syntax highlighting with language support, both inline and block.

**Usage:**

```html
<!-- inline -->
<code lang="python">lambda x: x**2</code>

<!-- block -->
<code lang="python">
  <pre>
    def square(x: int):
      return x**2
  </pre>
</code>
```

**Props:**

| Prop   | Type   | Required | Description       |
| :----- | :----- | :------- | :---------------- |
| `lang` | string | No       | Default to "text" |

**Caveat:**

Codes (e.g., html) may have to be escaped. There is an [online tool](https://emn178.github.io/online-tools/html_encode.html) for this.

### Mermaid

Render flowcharts and diagrams directly in your slides.

**Usage:**

```html
<Mermaid>
  <pre>
    flowchart LR
      Start --> Stop
  </pre>
</Mermaid>
```

### Citation

Cite literatures in an academic presentation.

**Usage:**

```html
<!-- single -->
<cite author="Vaswani" year="2017" />
<!-- multiple -->
<cite :list="[['Feynman', '1960', false], ['Einstein', '1940']]" />
```

**Props:**

| Prop     | Type    | Required | Description                     |
| :------- | :------ | :------- | :------------------------------ |
| `author` | string  | No       | The author(s)                   |
| `year`   | string  | No       | The year                        |
| `etal`   | boolean | No       | Shows _et al._, default to true |
| `list`   | Array   | No       | List of citations               |

### Block

Analogous to the `block` environment in `beamer`.

**Usage:**

```html
<Block name="Theorem"> Any map can be colored using only four colors. </Block>
```

**Props:**

| Prop   | Type   | Required | Description |
| :----- | :----- | :------- | :---------- |
| `name` | string | No       | Block name  |

## Delicated Canvas Support

The project includes a `useCanvas` hook to handle High-DPI scaling and mouse coordinate mapping automatically.

**Usage:**

```html
<script setup>
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
  }

  const { canvas, style, getMousePosition, redraw } = useCanvas(500, 240, draw);

  function handleMouseMove(e) {
    try {
      const pos = getMousePosition(e);
      redraw("mousemove", pos);
    } catch (err) {
      // Canvas might not be ready yet
    }
  }
</script>

<template>
  <frame title="Canvas">
    <canvas ref="canvas" :style="style" @mousemove="handleMouseMove" />
  </frame>
</template>
```
