/** Tiny Web Audio helpers – no external files needed */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      audioCtx = null;
    }
  }
  return audioCtx;
}

function playTone(freq, duration, type = "sine", vol = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* Web Audio unavailable */
  }
}

/** Filtered white-noise burst, useful for whooshes and pops */
function playNoise(duration = 0.3, volume = 0.12, lowpass = 1000) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lowpass;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch {
    /* ignore */
  }
}

export function playStarCollect() {
  playTone(880, 0.15);
  setTimeout(() => playTone(1174, 0.15), 80);
  setTimeout(() => playTone(1318, 0.2), 160);
}

export function playClick() {
  playTone(600, 0.08, "square", 0.08);
}

export function playButtonHover() {
  playTone(2200, 0.04, "sine", 0.03);
}

export function playComplete() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.25, "sine", 0.12), i * 120));
}

export function playPop() {
  playNoise(0.12, 0.2, 1400);
  playTone(300, 0.08, "triangle", 0.1);
}

export function playBlow() {
  playNoise(0.5, 0.12, 500);
}

export function playSmoke() {
  playNoise(0.35, 0.06, 900);
}

export function playFirework() {
  playNoise(0.3, 0.16, 2500);
  playTone(180, 0.25, "square", 0.05);
}

export function playCelebration() {
  const notes = [523, 659, 784, 1047, 784, 1047, 1318];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.2, "sine", 0.1), i * 100));
}

export function playSparkle() {
  const notes = [2093, 2637, 3136, 3951];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.12, "sine", 0.04), i * 60));
}

export function playTreasureOpen() {
  const notes = [392, 494, 587, 784];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.18, "triangle", 0.09), i * 90));
  setTimeout(() => playNoise(0.6, 0.06, 2000), 100);
}

export function playPuzzleSolved() {
  const chord = [523, 659, 784, 1047];
  chord.forEach((n) => playTone(n, 0.5, "sine", 0.07));
  setTimeout(() => playSparkle(), 150);
}

export function playLetterOpen() {
  playNoise(0.4, 0.06, 600);
  setTimeout(() => playTone(660, 0.2, "sine", 0.06), 100);
}

export function playPaperUnfold() {
  playNoise(0.5, 0.08, 900);
  setTimeout(() => playTone(880, 0.15, "sine", 0.04), 200);
}

export function playHeart() {
  playTone(880, 0.18, "sine", 0.08);
  setTimeout(() => playTone(1174, 0.25, "sine", 0.07), 140);
}
