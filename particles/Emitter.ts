import { Particle, ParticleConfig } from './Particle';

/**
 * An interface containing the configuration for an Emitter
 *
 * @export
 * @interface EmitterConfig
 */
export interface EmitterConfig {
  /**
   * The x position of the Emitter on the canvas, (0, 0) is the top left corner of the canvas
   *
   * @type {number}
   * @memberof EmitterConfig
   */
  x: number;

  /**
   * The y position of the Emitter on the canvas, (0, 0) is the top left corner of the canvas
   *
   * @type {number}
   * @memberof EmitterConfig
   */
  y: number;

  /**
   * The width of the Emitter
   *
   * @type {number}
   * @memberof EmitterConfig
   */
  width: number;

  /**
   * The height of the Emitter
   *
   * @type {number}
   * @memberof EmitterConfig
   */
  height: number;

  /**
   * The number of times Emitter should emit particles before it's considered dead
   *
   * @type {number}
   * @memberof EmitterConfig
   */
  numberOfEmissions?: number;

  /**
   * A number between 1 and 100 controlling the rate at which this Emitter should emit (1, is the minimmum frequency, 100 is the maximum frequency)
   *
   * @type {number}
   * @memberof EmitterConfig
   */
  emissionFrequency?: number;

  /**
   * The total number of particles that can be alive from an Emitter at any given time.
   * If an Emitter attempts to emit and is blocked by the maxLivingParticles property, it will
   * attempt to emit every tick following that until successful, regardless of emissionFrequency
   *
   * @type {number}
   * @memberof EmitterConfig
   */
  maxLivingParticles?: number;

  /**
   * A number or a function that returns a number specifying the number of particles the emitter should emit in a single tick
   *
   * @type {number | () => number}
   * @memberof EmitterConfig
   */
  emitPerTick?: number | (() => number);
}

/**
 * A class that's responsible for controlling the way Particles are generated into a System
 *
 * @export
 * @class Emitter
 */
export class Emitter {
  /**
   * True if this Emitter will never emit another particle
   *
   * @type {boolean}
   * @memberof Emitter
   */
  dead: boolean;
  
  /**
   * A number specifying the number of particles the emitter should emit in a single tick
   *
   * @private
   * @type {number}
   * @memberof Emitter
   */
  private emitPerTick: number;

  /**
   * A number representing how many ticks be skipped before emitting. For example, if the value is set to 5,
   * ticks 1, 2, 3 and 4 will emit nothing, and then tick 5 will emit normally. This process will repeat for the life
   * of the Emitter.
   *
   * @private
   * @type {number}
   * @memberof Emitter
   */
  private emissionThreshold: number;

  /**
   * A simple counter measuring the number of ticks since the last successful emission
   *
   * @private
   * @memberof Emitter
   */
  private ticksSinceLastEmission = 0;

  /**
   * A running count of the number of times this Emitter has successfully emitted
   *
   * @private
   * @memberof Emitter
   */
  private emissionCounter = 0;

  constructor(private particleConfig: ParticleConfig, private emitterConfig: EmitterConfig) {
    // calculate the emissionThreshold value from the config's emissionFrequency value
    this.emissionThreshold = 100 / (this.emitterConfig.emissionFrequency ? this.emitterConfig.emissionFrequency : 100);

    // calculate the emitPerTick from the corresponding config value, or call the config function if applicable
    this.emitPerTick = (typeof emitterConfig.emitPerTick === 'function') ? emitterConfig.emitPerTick() : emitterConfig.emitPerTick;
  }

  /**
   * Attempt to create a number of particles and return them
   *
   * @param {number} [currentParticleCount]
   * @returns {Particle[]}
   * @memberof Emitter
   */
  emit(currentParticleCount?: number): Particle[] {
    if (this.shouldEmit(currentParticleCount) && !this.dead) {
      // if the Emitter can emit this tick and the Emitter isn't dead

      const particles: Particle[] = [];

      // create the appropriate number of particles and add them to the particles array
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
        // if we specified a fixed number of emissions and we've now passed that number, consider the Emitter dead
        this.dead = true;
      }

      return particles;
    }

    return null;
  }

  /**
   * Returns true if the Emitter can emit successfuly, false otherwise
   *
   * @param {number} [currentParticleCount]
   * @returns {boolean}
   * @memberof Emitter
   */
  shouldEmit(currentParticleCount?: number): boolean {
    this.ticksSinceLastEmission += this.emitPerTick || 1;

    if (
      this.ticksSinceLastEmission >= this.emissionThreshold && // the emissionFrequency doesn't prohibit this Emitter from emitting this tick
      (!this.emitterConfig.maxLivingParticles || !currentParticleCount || currentParticleCount < this.emitterConfig.maxLivingParticles) // there is no restriction on the number of living particles or we are currently under that cap
    ) {
      // allow emission
      this.ticksSinceLastEmission = 0;
      return true;
    }


    return false;
  }

  /**
   * Returns a number specifying the amount of particles that should be emitted this tick
   *
   * @returns
   * @memberof Emitter
   */
  calculateEmissionCount() {
    let count = 1;

    if (this.emitPerTick) {
      count = this.emitPerTick;
    }

    if (this.emitterConfig.maxLivingParticles) {
      // throttle the number of particles by the maximum number of allowed particles
      count = Math.min(count, this.emitterConfig.maxLivingParticles)
    }

    return count;
  }
}

/**
 * A simple function for generating a number between min inclusive & max inclusive
 *
 * @param {number} min the inclusive lower bound
 * @param {number} max the inclusive upper bound
 * @returns
 */
function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}