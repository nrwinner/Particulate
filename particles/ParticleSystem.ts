import { Emitter } from "./Emitter";
import { Particle, Shape } from './Particle';

/**
 * An interface for passing additional options to the ParticleSystem
 *
 * @export
 * @interface ParticleSysteOptions
 */
export interface ParticleSysteOptions {
  /**
   * Fast forward the particle system a number of ticks and begin animating from that point
   *
   * @type {number}
   * @memberof ParticleSysteOptions
   */
  startAtTick?: number;
}

/**
 * A class for maintaining a particle emitter and a list of active particles
 *
 * @export
 * @class ParticleSystem
 */
export class ParticleSystem {
  /**
   * True if the system has no living particles and will never emit another particle
   *
   * @type {boolean}
   * @memberof ParticleSystem
   */
  dead: boolean;

  /**
   * An object containing the width and height properties of the canvas being used by the system
   *
   * @type {{ w: number, h: number }}
   * @memberof ParticleSystem
   */
  canvasSize: { w: number, h: number };

  /**
   * The context used by the system to render particles
   *
   * @type {CanvasRenderingContext2D}
   * @memberof ParticleSystem
   */
  context: CanvasRenderingContext2D;
  
  /**
   * True if this system is currently running
   *
   * @type {boolean}
   * @memberof ParticleSystem
   */
  running: boolean;

  /**
   * List of living Particles in the current system
   *
   * @private
   * @type {Particle[]}
   * @memberof ParticleSystem
   */
  private particles: Particle[] = [];

  /**
   * True if this system has been started at least once, used when determining if the system should skip to a particular ticks
   *
   * @private
   * @type {boolean}
   * @memberof ParticleSystem
   */
  private hasStarted: boolean;

  constructor(private emitter: Emitter, private options?: ParticleSysteOptions) { }

  /**
   * Start the ParticleSystem
   *
   * @memberof ParticleSystem
   */
  start() {
    // don't do anything if the system is already running
    if (!this.running) {
      this.running = true;

      // if we've passed in the option to skip ahead to a specific tick and the system has never been started before
      if (this.options && this.options.startAtTick && !this.hasStarted) {
        
        // process the specified number of ticks without animating
        for (let i = 0; i < this.options.startAtTick; i++) {
          this.tick();
        }
      }

      this.hasStarted = true;
    }
  }

  /**
   * Stop the particle system in it's place without destroying it.
   * The system can be restarted and it will continue from where it left off.
   *
   * @memberof ParticleSystem
   */
  stop() {
    // do nothing if the system isn't running
    if (this.running) {
      // stop the system
      this.running = false;
    }
  }

  /**
   * Iterates the list of living particles, ticks them, and controls the particle rendering/removal process
   *
   * @memberof ParticleSystem
   */
  tick(): void {
    if (this.running && !this.dead) {

      // save the current context to re-render after iterating and rendering particles
      this.context.save();

      // An array of new particles that were emitted. These won't render until next tick to avoid modifying the particles list while we're iterating it.
      const newParticles: Particle[] = this.emitter.emit(this.particles.length);
      const livingParticles: Particle[] = [];

      for (let i = 0, l = this.particles.length; i < l; i++) {
        const p = this.particles[i];
        
        // For each particle, call its tick function. Any changes that should happen to the particle in this tick occur here
        p.tick();

        if (
          p.position.y >= this.canvasSize.h || p.position.y <= 0
          || p.position.x >= this.canvasSize.w || p.position.x <= 0
        ) {
          // if this particle is now off-screen, it is dead and can be removed
          p.dead = true;
        }

        if (!p.dead) {
          // if the particle is not dead, add it to the livingParticles list. We'll replace this.particles with this list later to
          // remove dead particles without modifying the list we're iterating
          livingParticles.push(p);

          // the particle is still on screen, render it
          this.context.beginPath();

          // render the appropriate shape for the particle
          switch (p.shape) {
            case Shape.CIRCLE:
              this.context.arc(p.position.x, p.position.y, p.size.w, 0, 360);
              break;
            default:
              this.context.rect(p.position.x, p.position.y, p.size.w, p.size.h);
              break;
          }
      
          this.context.fillStyle = p.color;
          this.context.fill();

          this.context.closePath();
        }
      }

      if (newParticles) {
        // the new particles we've emitted this tick will be rendered next tick, so 
        livingParticles.push(...newParticles);
      }

      // swap this.particles with the content of livingParticles to remove any dead particles
      this.particles = livingParticles;

      // restore the context we saved earlier so that any previous particles/systems/scenes are rendered correctly
      this.context.restore();
      
      if (!this.particles.length && this.emitter.dead) {
        // if the emitter is dead and there are no living particles, this system is dead
        this.dead = true;
      }
    }
  };
}
