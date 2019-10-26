import { Particle, ParticleConfig } from "./ParticleSystem";

export interface EmitterConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  emitPerTick?: number | (() => number);
  numberOfEmissions?: number;
  emissionFrequency?: number;
  maxLivingParticles?: number;
}

export class Emitter {
  dead: boolean;

  private emitPerTick: number;
  private emissionThreshold: number;
  private ticksSinceLastEmission = 0;
  private emissionCounter = 0;

  constructor(private particleConfig: ParticleConfig, private emitterConfig: EmitterConfig) {
    this.emissionThreshold = 100 / (this.emitterConfig.emissionFrequency ? this.emitterConfig.emissionFrequency : 100);

    this.emitPerTick = (typeof emitterConfig.emitPerTick === 'function') ? emitterConfig.emitPerTick() : emitterConfig.emitPerTick;
  }

  emit(currentParticleCount?: number): Particle[] {
    if (this.shouldEmit(currentParticleCount) && !this.dead) {
      const particles: Particle[] = [];

      for (let i = 0; i < this.calculateEmissionCount(); i++) {
        const p = new Particle(
          {
            x: random(this.emitterConfig.x, this.emitterConfig.x + this.emitterConfig.width),
            y: random(this.emitterConfig.y, this.emitterConfig.y + this.emitterConfig.height),
          },
          this.particleConfig
        )
        particles.push(p);
      }

      if (this.emitterConfig.numberOfEmissions && ++this.emissionCounter >= this.emitterConfig.numberOfEmissions) {
        this.dead = true;
      }

      return particles;
    }

    return null;
  }

  shouldEmit(currentParticleCount?: number): boolean {
    this.ticksSinceLastEmission += this.emitPerTick || 1;

    if (
      this.ticksSinceLastEmission >= this.emissionThreshold &&
      (!this.emitterConfig.maxLivingParticles || !currentParticleCount || currentParticleCount < this.emitterConfig.maxLivingParticles)
    ) {
      this.ticksSinceLastEmission = 0;
      return true;
    }


    return false;
  }

  calculateEmissionCount() {
    let count = 1;

    if (this.emitPerTick) {
      count = this.emitPerTick;
    }

    if (this.emitterConfig.maxLivingParticles) {
      count = Math.min(count, this.emitterConfig.maxLivingParticles)
    }

    return count;
  }
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}