/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class DopplerAudioEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning: boolean = false;
  private baseFreq: number = 320; // Hz

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playRippleSound(volume: number = 0.3) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      // Water droplet frequency drop chirp
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(Math.min(1, volume * 0.4), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public startContinuousTone(baseFreq = 300, volume = 0.2) {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isRunning) return;

      this.baseFreq = baseFreq;
      this.osc = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      this.osc.type = 'triangle';
      this.osc.frequency.setValueAtTime(this.baseFreq, this.ctx.currentTime);

      this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(volume * 0.25, this.ctx.currentTime + 0.1);

      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc.start();
      this.isRunning = true;
    } catch {
      // Ignore audio start errors
    }
  }

  public updateDopplerPitch(observedFreqRatio: number, volume = 0.2) {
    if (!this.ctx || !this.osc || !this.gainNode || !this.isRunning) return;
    try {
      const targetFreq = Math.max(50, Math.min(2000, this.baseFreq * observedFreqRatio));
      const now = this.ctx.currentTime;
      this.osc.frequency.setTargetAtTime(targetFreq, now, 0.05);
      this.gainNode.gain.setTargetAtTime(volume * 0.25, now, 0.05);
    } catch {
      // Pitch update safe catch
    }
  }

  public stopContinuousTone() {
    if (!this.ctx || !this.osc || !this.gainNode || !this.isRunning) return;
    try {
      const now = this.ctx.currentTime;
      this.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.08);
      setTimeout(() => {
        try {
          this.osc?.stop();
          this.osc?.disconnect();
          this.gainNode?.disconnect();
        } catch {
          // cleanup safe catch
        }
        this.osc = null;
        this.gainNode = null;
        this.isRunning = false;
      }, 100);
    } catch {
      this.isRunning = false;
    }
  }
}

export const audioManager = new DopplerAudioEngine();
