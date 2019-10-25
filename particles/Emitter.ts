import { Particle, ParticleConfig } from "./systems/ParticleSystem";

export interface EmitterConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  emitPerTick?: number;
  emissionFrequency?: number;
  maxLivingParticles?: number;
}

export class Emitter<T extends Particle> {
  private emissionThreshold: number;
  private emissionCounter = 0;

  constructor(private particleConfig: ParticleConfig, private emitterConfig: EmitterConfig) {
    this.emissionThreshold = 100 / (this.emitterConfig.emissionFrequency ? this.emitterConfig.emissionFrequency : 100);
  }

  emit(currentParticleCount?: number): Particle[] {
    if (this.shouldEmit(currentParticleCount)) {
      let pos = {
        x: random(this.emitterConfig.x, this.emitterConfig.x + this.emitterConfig.width),
        y: random(this.emitterConfig.y, this.emitterConfig.y + this.emitterConfig.height),
      }
      const p = new Particle(
       pos,
       this.particleConfig
      );

      return [ p ];
    }
    
    return null;
  }

  shouldEmit(currentParticleCount?: number): boolean {
    this.emissionCounter++;

    if (
      this.emissionCounter > this.emissionThreshold &&
      (!this.emitterConfig.maxLivingParticles || !currentParticleCount || currentParticleCount < this.emitterConfig.maxLivingParticles)
    ) {
      this.emissionCounter = 0;
      return true;
    }

    return false;
  }
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}