import { Emitter } from "./Emitter";

/**
 * The ParticleSystem class defines the position of the emitter on the canvas as well as it's dimensions
 *
 * @export
 * @abstract
 * @class ParticleSystem
 */
export class ParticleSystem {
  dead: boolean;
  private running: boolean;

  private particles: Particle[] = [];

  constructor(
    private emitter: Emitter,
    private context: CanvasRenderingContext2D,
    private canvasWidth: number,
    private canvasHeight: number,
  ) { }

  start() {
    if (!this.running) {      
      this.running = true;
    }
  }

  stop() {
    this.running = false;
  }

  get status(): boolean {
    return this.running;
  }

  tick(): void {
    if (this.status && !this.dead) {

      this.context.save();

      const newParticles: Particle[] = this.emitter.emit(this.particles.length);
      const livingParticles: Particle[] = [];

      for (let i = 0, l = this.particles.length; i < l; i++) {
        const p = this.particles[i];
        
        p.tick();

        if (
          p.position.y >= this.canvasHeight || p.position.y <= 0
          || p.position.x >= this.canvasWidth || p.position.x <= 0
        ) {
          p.dead = true;
        }

        if (!p.dead) {
          livingParticles.push(p);

          this.context.beginPath();
          this.drawParticle(p);
          this.context.closePath();
        }
      }

      if (newParticles) {
        livingParticles.push(...newParticles);
      }

      this.particles = livingParticles;

      this.context.restore();
      
      if (!this.particles.length && this.emitter.dead) {
        this.dead = true;
      }
    }
  };

  private drawParticle(particle: Particle) {
    particle.generateCanvasElement(this.context);
  }
}

/**
 * The Particle class defines the properties of a particle, IE speed, direction
 *
 * @export
 * @abstract
 * @class Particle
 */
export class Particle {
  dead: boolean;

  size: { w: number, h: number };
  vector: number;
  speed: number;
  color: string;
  shape: string;
  timeToLive: number;

  tickCount: number;

  // if an animation function is passed in, this is used to store state for it. Can be anything
  animationState: any;

  spawnTime: number;

  constructor(public position: { x: number, y: number }, private config: ParticleConfig) {
    this.size = typeof this.config.size  === 'function' ? this.config.size() : this.config.size;
    this.vector = typeof this.config.vector  === 'function' ? this.config.vector() : this.config.vector;
    this.speed = typeof this.config.speed  === 'function' ? this.config.speed() : this.config.speed;
    this.color = typeof this.config.color  === 'function' ? this.config.color() : this.config.color;
    this.shape = typeof this.config.shape  === 'function' ? this.config.shape() : this.config.shape;
    this.timeToLive = typeof this.config.timeToLive  === 'function' ? this.config.timeToLive() : this.config.timeToLive;

    this.spawnTime = Date.now();
  }

  tick(): void {
    if (this.config.animation) {
      this.config.animation(this)
    } else {
      this.calculateLinearMove();
    }

    this.tickCount++;

    if (this.timeToLive && Date.now() - this.spawnTime > this.timeToLive) {
      this.dead = true;
    }
  };

  generateCanvasElement(ctx: CanvasRenderingContext2D): void {
    switch (this.shape) {
      case Shape.CIRCLE:
        ctx.arc(this.position.x, this.position.y, this.size.w, 0, 360);
        break;
      default:
        ctx.rect(this.position.x, this.position.y, this.size.w, this.size.h);
        break;
    }

    ctx.fillStyle = this.color;
    ctx.fill();
  };

  calculateLinearMove() {
    this.position.x += Math.sin(this.vector * (Math.PI / 180)) * this.speed;
    this.position.y += Math.cos(this.vector * (Math.PI / 180)) * this.speed;
  }
}

export enum Shape {
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle'
}

export interface ParticleConfig {
  size: { w: number, h: number } | (() => { w: number, h: number });
  speed: number | (() => number);
  vector: number | (() => number);
  color: string | (() => string);
  shape: Shape | (() => Shape);
  animation?: (x: Particle) => void;
  timeToLive?: number | (() => number);
}