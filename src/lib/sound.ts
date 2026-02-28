let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => undefined);
  }
  return audioContext;
}

function playTone(
  frequency: number,
  durationMs: number,
  type: OscillatorType,
  volume: number,
  startTimeOffset = 0
): void {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = 0;

  oscillator.connect(gain);
  gain.connect(context.destination);

  const now = context.currentTime + startTimeOffset;
  const attack = 0.01;
  const release = Math.max(durationMs / 1000 - attack, 0.02);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.linearRampToValueAtTime(0, now + attack + release);

  oscillator.start(now);
  oscillator.stop(now + attack + release);
}

export function playClickSound(): void {
  playTone(620, 80, 'sine', 0.08);
}

export function playShimmerSound(): void {
  playTone(520, 140, 'triangle', 0.06, 0);
  playTone(660, 140, 'triangle', 0.05, 0.06);
  playTone(820, 140, 'triangle', 0.04, 0.12);
}
