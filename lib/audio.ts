/**
 * Advanced Web Audio API synthesizer for instant, ultra-crisp chess sound effects.
 * 100% self-contained, zero external audio asset dependencies, works offline & lag-free.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.8;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedEnabled = localStorage.getItem('chess_sound_enabled');
        if (storedEnabled !== null) {
          this.enabled = storedEnabled === 'true';
        }
        const storedVol = localStorage.getItem('chess_sound_volume');
        if (storedVol !== null) {
          const parsed = parseFloat(storedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.volume = parsed;
          }
        }
      } catch {
        // ignore storage errors
      }
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    try {
      localStorage.setItem('chess_sound_enabled', String(val));
    } catch {
      // ignore
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    try {
      localStorage.setItem('chess_sound_volume', String(this.volume));
    } catch {
      // ignore
    }
  }

  /**
   * Helper: Generate a short burst of noise for realistic wood impact transients
   */
  private createNoiseBuffer(duration: number): AudioBuffer | null {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * 1. Standard Piece Move (Crisp, tactile wooden placement click)
   */
  public playMove() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, t);
    masterGain.connect(ctx.destination);

    // Layer A: Wood transient click (noise burst through bandpass filter)
    const noiseBuffer = this.createNoiseBuffer(0.025);
    if (noiseBuffer) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, t);
      filter.Q.setValueAtTime(3.5, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.55, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noiseSource.start(t);
      noiseSource.stop(t + 0.025);
    }

    // Layer B: Wood body acoustic resonance (Triangle frequency sweep)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(130, t + 0.055);

    oscGain.gain.setValueAtTime(0.45, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.055);

    // Layer C: Low frequency board dampening thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, t);
    subOsc.frequency.exponentialRampToValueAtTime(60, t + 0.045);

    subGain.gain.setValueAtTime(0.35, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    subOsc.connect(subGain);
    subGain.connect(masterGain);

    subOsc.start(t);
    subOsc.stop(t + 0.045);
  }

  /**
   * 2. Piece Capture (Deep, punchy two-piece physical collision)
   */
  public playCapture() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, t);
    masterGain.connect(ctx.destination);

    // Layer A: Sharp primary wood-on-wood collision click
    const noiseBuffer = this.createNoiseBuffer(0.035);
    if (noiseBuffer) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.Q.setValueAtTime(2.5, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noiseSource.start(t);
      noiseSource.stop(t + 0.035);
    }

    // Layer B: Heavy punchy body resonance
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(460, t);
    osc1.frequency.exponentialRampToValueAtTime(85, t + 0.08);

    gain1.gain.setValueAtTime(0.65, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc1.connect(gain1);
    gain1.connect(masterGain);

    osc1.start(t);
    osc1.stop(t + 0.08);

    // Layer C: Low-end bass thump for heavy piece displacement
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220, t);
    osc2.frequency.exponentialRampToValueAtTime(45, t + 0.09);

    gain2.gain.setValueAtTime(0.5, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc2.start(t);
    osc2.stop(t + 0.09);

    // Layer D: Secondary micro-rattle (captured piece slide) at t + 18ms
    setTimeout(() => {
      if (!this.ctx || !this.enabled) return;
      const t2 = this.ctx.currentTime;
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();

      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(320, t2);
      osc3.frequency.exponentialRampToValueAtTime(110, t2 + 0.035);

      gain3.gain.setValueAtTime(0.3 * this.volume, t2);
      gain3.gain.exponentialRampToValueAtTime(0.001, t2 + 0.035);

      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);

      osc3.start(t2);
      osc3.stop(t2 + 0.035);
    }, 18);
  }

  /**
   * 3. Check Alert (Crystal clear, commanding dual-tone warning chime)
   */
  public playCheck() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, t);
    masterGain.connect(ctx.destination);

    // High clarity check chime: 780Hz rising immediately to 1040Hz with sparkling harmonics
    const freqs = [
      { f: 784, startGain: 0.45, decay: 0.28 },     // G5 fundamental
      { f: 1046.5, startGain: 0.55, decay: 0.35 },  // C6 sharp chime
      { f: 2093, startGain: 0.18, decay: 0.18 },    // C7 sparkle harmonic
    ];

    freqs.forEach(({ f, startGain, decay }, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, t + (idx === 1 ? 0.03 : 0));

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(startGain, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + decay);
    });
  }

  /**
   * 4. Castling (Dual rhythmic piece slide and firm placements)
   */
  public playCastle() {
    if (!this.enabled || this.volume <= 0) return;
    this.playMove();
    setTimeout(() => {
      this.playMove();
    }, 110);
  }

  /**
   * 5. Pawn Promotion (Triumphant ascending 3-note harmonic chime)
   */
  public playPromotion() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [659.25, 783.99, 1046.5]; // E5 -> G5 -> C6
    notes.forEach((freq, idx) => {
      const t = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.4 * this.volume, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  /**
   * 6. Illegal Move / Error Knock (Subtle muted wood reject tap)
   */
  public playIllegal() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, t);

    gain.gain.setValueAtTime(0.25 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  /**
   * 7. Game End (Victor's triumphant fanfare or respectful defeat cadence)
   */
  public playGameEnd(won: boolean = true) {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = won
      ? [523.25, 659.25, 783.99, 1046.5] // C5 -> E5 -> G5 -> C6
      : [440, 392, 349.23, 293.66];      // A4 -> G4 -> F4 -> D4

    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.35 * this.volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  /**
   * 8. Clock Low Time Tick (< 10 seconds percussive urgency tick)
   */
  public playClockTick() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.025);

    gain.gain.setValueAtTime(0.12 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  /**
   * 9. Draw Offer or Chat Notification Chime
   */
  public playNotification() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, t); // D5
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, t + 0.06); // A5

    gain.gain.setValueAtTime(0.25 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc1.stop(t + 0.25);
    osc2.start(t + 0.06);
    osc2.stop(t + 0.25);
  }
}

export const sound = new SoundEngine();
