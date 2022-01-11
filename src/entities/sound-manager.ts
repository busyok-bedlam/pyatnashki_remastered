import moveSound from '../assets/sounds/step.wav';

interface SoundManagerInstance {
  playStepSound(): void;
}

export default class SoundManager {
  private static instance: SoundManagerInstance;

  public static getInstance(): SoundManagerInstance {
    if (!SoundManager.instance) {
      SoundManager.instance = {
        playStepSound() {
          const audio = new Audio(moveSound);
          audio.play();
        },
      };
    }
    return SoundManager.instance;
  }
}
