let audioCtx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

// Mobile browsers only allow audio to start from a user gesture. Call this
// from the same click handler that starts a rest timer so the AudioContext
// is unlocked well before the alarm actually needs to play.
export function primeAudio() {
  getContext();
}

function beep(ctx, startTime, frequency, duration) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

// A short three-note chime for when the rest timer hits 0 — noticeable
// without an external audio file or asset to bundle.
export function playRestEndAlarm() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  beep(ctx, now, 880, 0.14);
  beep(ctx, now + 0.2, 880, 0.14);
  beep(ctx, now + 0.4, 1046.5, 0.24);
}
