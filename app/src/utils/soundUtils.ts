export type SoundOption = {
  id: string;
  name: string;
  description: string;
  frequency: number; // Primary frequency for tone generation
  pattern: 'beep' | 'chime' | 'bell' | 'buzz' | 'gentle';
};

export const SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'beep',
    name: 'Beep',
    description: 'Classic beep sound',
    frequency: 800,
    pattern: 'beep',
  },
  {
    id: 'chime',
    name: 'Chime',
    description: 'Pleasant chime',
    frequency: 523.25, // C5
    pattern: 'chime',
  },
  {
    id: 'bell',
    name: 'Bell',
    description: 'Soft bell tone',
    frequency: 659.25, // E5
    pattern: 'bell',
  },
  {
    id: 'buzz',
    name: 'Buzz',
    description: 'Urgent buzz',
    frequency: 440,
    pattern: 'buzz',
  },
  {
    id: 'gentle',
    name: 'Gentle',
    description: 'Soft and gentle',
    frequency: 392, // G4
    pattern: 'gentle',
  },
];

export class SoundPlayer {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  playSound(soundId: string, volume: number = 0.3): void {
    const sound = SOUND_OPTIONS.find((s) => s.id === soundId);
    if (!sound) return;

    const context = this.getAudioContext();
    const now = context.currentTime;

    switch (sound.pattern) {
      case 'beep':
        this.playBeep(context, sound.frequency, now, volume);
        break;
      case 'chime':
        this.playChime(context, sound.frequency, now, volume);
        break;
      case 'bell':
        this.playBell(context, sound.frequency, now, volume);
        break;
      case 'buzz':
        this.playBuzz(context, sound.frequency, now, volume);
        break;
      case 'gentle':
        this.playGentle(context, sound.frequency, now, volume);
        break;
    }
  }

  private playBeep(context: AudioContext, frequency: number, startTime: number, volume: number): void {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.5);
  }

  private playChime(context: AudioContext, frequency: number, startTime: number, volume: number): void {
    // Play three ascending tones
    const frequencies = [frequency, frequency * 1.25, frequency * 1.5];
    
    frequencies.forEach((freq, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const offset = index * 0.15;
      gainNode.gain.setValueAtTime(0, startTime + offset);
      gainNode.gain.linearRampToValueAtTime(volume * 0.7, startTime + offset + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + offset + 0.6);

      oscillator.start(startTime + offset);
      oscillator.stop(startTime + offset + 0.6);
    });
  }

  private playBell(context: AudioContext, frequency: number, startTime: number, volume: number): void {
    // Bell with harmonics
    const harmonics = [1, 2, 3];
    
    harmonics.forEach((harmonic, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency * harmonic;
      oscillator.type = 'sine';

      const harmonicVolume = volume / (harmonic * 2);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(harmonicVolume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 1.5);
    });
  }

  private playBuzz(context: AudioContext, frequency: number, startTime: number, volume: number): void {
    // Rapid repeated beeps
    for (let i = 0; i < 3; i++) {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'square';

      const offset = i * 0.2;
      gainNode.gain.setValueAtTime(0, startTime + offset);
      gainNode.gain.linearRampToValueAtTime(volume * 0.6, startTime + offset + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + offset + 0.15);

      oscillator.start(startTime + offset);
      oscillator.stop(startTime + offset + 0.15);
    }
  }

  private playGentle(context: AudioContext, frequency: number, startTime: number, volume: number): void {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 2);

    oscillator.start(startTime);
    oscillator.stop(startTime + 2);
  }

  previewSound(soundId: string): void {
    this.playSound(soundId, 0.2);
  }

  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Sound preferences storage
export function getSoundPreference(): string {
  return localStorage.getItem('timer-sound') || 'chime';
}

export function setSoundPreference(soundId: string): void {
  localStorage.setItem('timer-sound', soundId);
}

export function getVolumePreference(): number {
  const stored = localStorage.getItem('timer-volume');
  return stored ? parseFloat(stored) : 0.5;
}

export function setVolumePreference(volume: number): void {
  localStorage.setItem('timer-volume', volume.toString());
}
