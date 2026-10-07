/**
 * Kitaptan - Zhaksy Iske
 * Interactive Audio & Speech Synthesis Engine
 * Provides real fairy tale narration, Web Speech TTS (Kazakh/multilingual),
 * HTML5 Audio playback with automatic TTS fallback, and Web Audio SFX.
 */

// 1. Web Audio Sound Effects Synthesizer (Zero External Dependencies)
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Magical fairy tale opening chime
   */
  playFairyTaleChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + index * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 0.65);
    });
  }

  /**
   * Page flip sound
   */
  playPageTurn() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  /**
   * Victory / Success fanfare
   */
  playSuccessSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.55);
    });
  }

  /**
   * Heart / Good deed completed chime
   */
  playGoodDeedChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [392.0, 523.25, 659.25]; // G4, C5, E5
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + idx * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.15);
      osc.stop(ctx.currentTime + idx * 0.15 + 0.75);
    });
  }
}

export const sfx = new SoundEffects();

// 2. Full-featured Speech & Audio Narration Manager
export interface AudioPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  progressPercent: number;
  currentTimeSec: number;
  totalDurationSec: number;
  speed: number;
}

export type AudioStateListener = (state: AudioPlayerState) => void;

class FairyTaleAudioEngine {
  private utterance: SpeechSynthesisUtterance | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private currentText: string = "";
  private speed: number = 1.0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private timer: NodeJS.Timeout | null = null;
  private simulatedSeconds: number = 0;
  private totalDurationSeconds: number = 180;
  private isTTS: boolean = true;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Warm up voices
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded in browser
      };
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    this.emitState();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emitState() {
    const percent = Math.min(
      100,
      Math.round((this.simulatedSeconds / Math.max(1, this.totalDurationSeconds)) * 100)
    );
    const state: AudioPlayerState = {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      progressPercent: percent,
      currentTimeSec: this.simulatedSeconds,
      totalDurationSec: this.totalDurationSeconds,
      speed: this.speed,
    };
    this.listeners.forEach((l) => l(state));
  }

  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/[#*_~`>]/g, "")
      .replace(/[\r\n]+/g, " ")
      .trim();
  }

  private findBestVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Look for Kazakh voice (kk-KZ / kk)
    const kkVoice = voices.find((v) => v.lang.toLowerCase().startsWith("kk") || v.name.toLowerCase().includes("kazakh"));
    if (kkVoice) return kkVoice;

    // 2. Look for Russian / Central Asian voice with clear phonetics
    const ruVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ru"));
    if (ruVoice) return ruVoice;

    // 3. Look for Turkish or Turkish-adjacent (similar vowel harmony)
    const trVoice = voices.find((v) => v.lang.toLowerCase().startsWith("tr"));
    if (trVoice) return trVoice;

    // 4. Default voice
    return voices.find((v) => v.default) || voices[0] || null;
  }

  /**
   * Start reading or playing narration for a story
   */
  public playStory(
    text: string,
    options?: {
      audioUrl?: string;
      estimatedDurationSec?: number;
      speed?: number;
      onFinish?: () => void;
    }
  ) {
    if (typeof window === "undefined") return;

    this.stop();
    sfx.playFairyTaleChime();

    this.currentText = text;
    this.speed = options?.speed || this.speed || 1.0;
    this.totalDurationSeconds = options?.estimatedDurationSec || Math.max(60, Math.round(text.split(" ").length * 0.45));
    this.simulatedSeconds = 0;

    // If a valid external audio URL is provided and not a placeholder, try HTML5 Audio first
    const hasRealAudioUrl =
      options?.audioUrl &&
      options.audioUrl.startsWith("http") &&
      !options.audioUrl.includes("example.com") &&
      !options.audioUrl.includes("placeholder");

    if (hasRealAudioUrl && options?.audioUrl) {
      try {
        this.isTTS = false;
        this.audioEl = new Audio(options.audioUrl);
        this.audioEl.playbackRate = this.speed;

        this.audioEl.onloadedmetadata = () => {
          if (this.audioEl?.duration) {
            this.totalDurationSeconds = Math.round(this.audioEl.duration);
          }
        };

        this.audioEl.ontimeupdate = () => {
          if (this.audioEl) {
            this.simulatedSeconds = Math.round(this.audioEl.currentTime);
            this.emitState();
          }
        };

        this.audioEl.onended = () => {
          this.isPlaying = false;
          this.isPaused = false;
          this.emitState();
          options?.onFinish?.();
        };

        this.audioEl.onerror = () => {
          // Fallback to Web Speech API if audio file fails
          this.audioEl = null;
          this.startSpeechSynthesis(text, options?.onFinish);
        };

        this.audioEl.play().then(() => {
          this.isPlaying = true;
          this.isPaused = false;
          this.emitState();
        }).catch(() => {
          this.startSpeechSynthesis(text, options?.onFinish);
        });

        return;
      } catch {
        // Fallback
      }
    }

    // Default & reliable: Web Speech Synthesis
    this.startSpeechSynthesis(text, options?.onFinish);
  }

  private startSpeechSynthesis(text: string, onFinish?: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.startSimulatedTimer(onFinish);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleaned = this.cleanTextForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      const voice = this.findBestVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = "kk-KZ";
      }

      utterance.rate = Math.max(0.7, Math.min(1.5, this.speed * 0.95)); // Comfortable children story reading pace
      utterance.pitch = 1.05; // Slightly warmer pitch for children

      utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.startSimulatedTimer(onFinish);
        this.emitState();
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.timer) clearInterval(this.timer);
        this.simulatedSeconds = this.totalDurationSeconds;
        this.emitState();
        onFinish?.();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis error, continuing timer:", e);
      };

      this.utterance = utterance;
      this.isTTS = true;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Failed to start speech synthesis:", e);
      this.startSimulatedTimer(onFinish);
    }
  }

  private startSimulatedTimer(onFinish?: () => void) {
    if (this.timer) clearInterval(this.timer);
    this.isPlaying = true;
    this.isPaused = false;

    this.timer = setInterval(() => {
      if (this.isPaused) return;

      this.simulatedSeconds += 1;
      if (this.simulatedSeconds >= this.totalDurationSeconds) {
        this.simulatedSeconds = this.totalDurationSeconds;
        this.isPlaying = false;
        this.isPaused = false;
        if (this.timer) clearInterval(this.timer);
        this.emitState();
        onFinish?.();
      } else {
        this.emitState();
      }
    }, 1000 / this.speed);
  }

  /**
   * Pause playback
   */
  public pause() {
    if (typeof window === "undefined") return;

    this.isPaused = true;
    this.isPlaying = false;

    if (this.audioEl) {
      this.audioEl.pause();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }

    this.emitState();
  }

  /**
   * Resume playback
   */
  public resume() {
    if (typeof window === "undefined") return;

    this.isPaused = false;
    this.isPlaying = true;

    if (this.audioEl) {
      this.audioEl.play().catch(() => {});
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (this.currentText) {
        this.startSpeechSynthesis(this.currentText);
      }
    }

    this.emitState();
  }

  /**
   * Toggle between play / pause
   */
  public toggle(text?: string, options?: { audioUrl?: string; estimatedDurationSec?: number; onFinish?: () => void }) {
    if (this.isPlaying) {
      this.pause();
    } else if (this.isPaused) {
      this.resume();
    } else if (text || this.currentText) {
      this.playStory(text || this.currentText, options);
    }
  }

  /**
   * Stop playback completely
   */
  public stop() {
    if (typeof window === "undefined") return;

    this.isPlaying = false;
    this.isPaused = false;
    this.simulatedSeconds = 0;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    this.emitState();
  }

  /**
   * Set playback speed
   */
  public setSpeed(newSpeed: number) {
    this.speed = newSpeed;
    if (this.audioEl) {
      this.audioEl.playbackRate = newSpeed;
    }
    this.emitState();
  }

  /**
   * Seek / jump forward or backward in seconds
   */
  public seek(newSeconds: number) {
    this.simulatedSeconds = Math.max(0, Math.min(this.totalDurationSeconds, newSeconds));
    if (this.audioEl) {
      this.audioEl.currentTime = this.simulatedSeconds;
    }
    this.emitState();
  }
}

export const fairyTaleAudio = new FairyTaleAudioEngine();
