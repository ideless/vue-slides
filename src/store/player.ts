interface Frame {
  frameEl: Element;
  pauses: Array<Pause>;
}

interface Pause {
  pauseEl: Element;
  order: number;
}

interface ElTree {
  rootEl: Element;
  frames: Array<Frame>;
}

class PlayerNotInitialized extends Error {
  constructor() {
    super("Player not initialized");
  }
}

class FrameNumberOOR extends Error {
  constructor() {
    super("Frame number out of range");
  }
}

export class Player {
  /** A height-3 tree of #frames, .frame, .pause */
  private elTree?: ElTree;
  /** frame number, pause number (first unactivated) */
  private state: [number, number];
  /** The scroll position before entering fullscreen mode */
  private scrollPos: { x: number; y: number };

  private handlers = {
    fullscreenchange: () => {
      if (!document.fullscreenElement) {
        this.stop();
      }
    },
    keydown: (e: any) => {
      const k = e.key;
      const fk = ["ArrowRight", "ArrowDown", "n", " "];
      const bk = ["ArrowLeft", "ArrowUp", "p", "Backspace"];
      const nk = ["PageDown", "N"];
      const pk = ["PageUp", "P"];
      const hk = ["Home", "h"];
      const ek = ["End", "e"];

      // One step forward
      if (fk.includes(k)) {
        e.preventDefault();
        this.forward();
      }

      // One step backward
      if (bk.includes(k)) {
        e.preventDefault();
        this.backward();
      }

      // One frame forward
      if (nk.includes(k)) {
        e.preventDefault();
        this.nextFullFrame();
      }

      // One frame backward
      if (pk.includes(k)) {
        e.preventDefault();
        this.prevFullFrame();
      }

      // Jump to first frame
      if (hk.includes(k)) {
        e.preventDefault();
        this.firstFrame();
      }

      // Jump to last frame
      if (ek.includes(k)) {
        e.preventDefault();
        this.lastFrame();
      }
    },
  };

  constructor() {
    this.elTree = undefined;
    this.state = [0, 0];
    this.scrollPos = { x: 0, y: 0 };
  }

  /** parse the #frames, .frame, .pause into a height-3 tree */
  private parseElTree(): ElTree {
    const rootEl = document.getElementById("frames");

    if (!rootEl) {
      throw new Error("No #frames element found");
    }

    const elTree: ElTree = {
      rootEl,
      frames: [],
    };

    rootEl.querySelectorAll(".frame").forEach((frameEl) => {
      const pauses: Pause[] = [];

      frameEl.querySelectorAll(".pause").forEach((pauseEl) => {
        const o = pauseEl.getAttribute("order");
        const order = o && o.match(/^\d+$/) ? Number(o) : 1; // Order defaults to 1

        pauses.push({ pauseEl, order });
      });

      // Pauses are sorted by order
      pauses.sort((a, b) => a.order - b.order);

      elTree.frames.push({ frameEl, pauses });
    });

    return elTree;
  }

  /** Activate a frame and all the order-0 pauses, update the internal state */
  private activateFrame(fn: number, skipPauses = false) {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (!this.elTree.frames[fn]) {
      throw new FrameNumberOOR();
    }

    const f = this.elTree.frames[fn];

    f.frameEl.classList.add("active");

    if (!skipPauses) {
      this.state = [fn, 0];

      for (let i = 0; i < f.pauses.length; i++) {
        const p = f.pauses[i];

        if (p.order == 0) {
          p.pauseEl.classList.add("active");
          this.state[1] = i + 1;
        } else {
          p.pauseEl.classList.remove("active");
        }
      }
    } else {
      this.state = [fn, f.pauses.length];
      f.pauses.forEach((p) => p.pauseEl.classList.add("active"));
    }
  }

  /** Deactivate the frame, leaving the internal state undefined */
  private deactivateFrame(fn: number, skipPauses = false) {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (!this.elTree.frames[fn]) {
      throw new FrameNumberOOR();
    }

    const f = this.elTree.frames[fn];

    f.frameEl.classList.remove("active");

    if (!skipPauses) {
      f.pauses.forEach((p) => p.pauseEl.classList.remove("active"));
    }
  }

  /** Activate pauses of the same next order, update the internal state */
  private activatePause(fn: number, pn: number) {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (!this.elTree.frames[fn]) {
      throw new FrameNumberOOR();
    } else if (!this.elTree.frames[fn].pauses[pn]) {
      throw new Error("Pause number out of range");
    }

    const f = this.elTree.frames[fn];
    const p = f.pauses[pn];
    let i = pn;

    while (i < f.pauses.length && f.pauses[i].order == p.order) {
      f.pauses[i].pauseEl.classList.add("active");
      i++;
    }

    this.state = [fn, i];
  }

  /** Deactivate pauses of the same next order, update the internal state */
  private deactivatePause(fn: number, pn: number) {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (!this.elTree.frames[fn]) {
      throw new FrameNumberOOR();
    } else if (!this.elTree.frames[fn].pauses[pn]) {
      throw new Error("Pause number out of range");
    }

    const f = this.elTree.frames[fn];
    const p = f.pauses[pn];
    let i = pn;

    while (i >= 0 && f.pauses[i].order == p.order) {
      f.pauses[i].pauseEl.classList.remove("active");
      i--;
    }

    this.state = [fn, i + 1];
  }

  /** Go into fullscreen mode */
  private setupScene() {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (this.elTree.frames.length == 0) {
      throw new Error("No frames");
    }

    this.elTree.rootEl.requestFullscreen();
    this.elTree.rootEl.classList.add("playing");
    this.activateFrame(this.state[0]);
  }

  /** Go back to normal mode, clean up */
  private closeScene() {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    }

    if (document.fullscreenElement) document.exitFullscreen();
    this.elTree.rootEl.classList.remove("playing");
    this.elTree.frames.forEach((_, i) => this.deactivateFrame(i));
  }

  /** Listen to keyboard and mouse events */
  private bindEvents() {
    for (const ev in this.handlers) {
      document.addEventListener(
        ev,
        this.handlers[ev as keyof typeof this.handlers],
      );
    }
  }

  /** Remove keyboard and mouse event handlers */
  private unbindEvents() {
    for (const ev in this.handlers) {
      document.removeEventListener(
        ev,
        this.handlers[ev as keyof typeof this.handlers],
      );
    }
  }

  /** Record the scroll position before entering */
  private recordScrollPos() {
    this.scrollPos = {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
    };
  }

  /** Restore to the scroll position after exiting */
  private restoreScrollPos() {
    window.scrollTo(this.scrollPos.x, this.scrollPos.y);
  }

  /** Start the player */
  start(frame = 0) {
    this.elTree = this.parseElTree();
    this.state = [frame, 0];

    this.recordScrollPos();
    this.setupScene();
    this.bindEvents();
  }

  /** Stop the player */
  stop() {
    this.unbindEvents();
    this.closeScene();
    this.restoreScrollPos();

    this.state = [0, 0];
    this.elTree = undefined;
  }

  /** One step forward, returns whether it succeeds */
  forward() {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (!this.elTree.frames[this.state[0]]) {
      throw new FrameNumberOOR();
    }

    const [fn, pn] = this.state;
    const f = this.elTree.frames[fn];

    if (pn < f.pauses.length) {
      this.activatePause(fn, pn);
    } else if (fn + 1 < this.elTree.frames.length) {
      this.deactivateFrame(fn, true);
      this.activateFrame(fn + 1);
    } else {
      return false;
    }

    return true;
  }

  /** One step backward, returns whether it succeeds */
  backward() {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (!this.elTree.frames[this.state[0]]) {
      throw new FrameNumberOOR();
    }

    const [fn, pn] = this.state;
    const f = this.elTree.frames[fn];

    if (pn > 0 && f.pauses[pn - 1].order > 0) {
      this.deactivatePause(fn, pn - 1);
    } else if (fn > 0) {
      this.deactivateFrame(fn);
      this.activateFrame(fn - 1, true);
    } else {
      return false;
    }

    return true;
  }

  /** Next full frame, returns whether it succeeds */
  nextFullFrame() {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    } else if (!this.elTree.frames[this.state[0]]) {
      throw new FrameNumberOOR();
    }

    const [fn, pn] = this.state;

    if (pn < this.elTree.frames[fn].pauses.length) {
      this.activateFrame(fn, true);
    } else if (fn + 1 < this.elTree.frames.length) {
      this.deactivateFrame(fn, true);
      this.activateFrame(fn + 1, true);
    } else {
      return false;
    }

    return true;
  }

  /** Previous full frame, returns whether it succeeds */
  prevFullFrame() {
    const fn = this.state[0];

    if (fn > 0) {
      this.deactivateFrame(fn);
      this.activateFrame(fn - 1, true);
      return true;
    } else {
      return false;
    }
  }

  firstFrame() {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    }

    if (this.elTree.frames.length == 0) {
      return false;
    }

    this.deactivateFrame(this.state[0]);
    this.activateFrame(0);
    return true;
  }

  lastFrame() {
    if (!this.elTree) {
      throw new PlayerNotInitialized();
    }

    if (this.elTree.frames.length == 0) {
      return false;
    }

    this.deactivateFrame(this.state[0]);
    this.activateFrame(this.elTree.frames.length - 1, true);
    return true;
  }

  /** Current frame number */
  get frameNum() {
    return this.state[0];
  }

  /** Whether the player is playing */
  get playing() {
    return !!this.elTree;
  }
}
