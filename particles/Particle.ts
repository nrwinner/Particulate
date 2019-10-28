
/**
 * A class for maintaining all properties related to a single particle
 *
 * @export
 * @abstract
 * @class Particle
 */
export class Particle {
  /**
   * True if this particle should never be rendered again
   *
   * @type {boolean}
   * @memberof Particle
   */
  dead: boolean;

  /**
   * An object containing the width and height of this particle. The height property is optional if rendering a Shape.CIRCLE
   *
   * @type {{ w: number, h: number }}
   * @memberof Particle
   */
  size: { w: number, h: number };
  
  /**
   * A number representing the angle (in degrees) from the emitter that this particle should travel. 0 travels straight down from the emitter, 180 straight up.
   * Due to the nature of degrees, this number can be added to and subtracted from indefinitely. 0, 360, 720, 1080 will all travel straight down.
   *
   * @type {number}
   * @memberof Particle
   */
  vector: number;

  /**
   * A number controlling the speed of the particle. Translates to the number of pixels traversed by the pixel in a single tick
   *
   * @type {number}
   * @memberof Particle
   */
  speed: number;

  
  /**
   * A string prepresenting the color of this pixel
   * Can be in format 'black' or 'rgb(0, 0, 0)' or 'rgba(0, 0, 0, 1)'
   *
   * @type {string}
   * @memberof Particle
   */
  color: string;

  /**
   * A string representing the shape of the particle. Can be either 'rectangle' or 'circle'
   *
   * @type {Shape}
   * @memberof Particle
   */
  shape: Shape;

  /**
   * A number representing the number of milliseconds this particle should live. If specified, when that time has elapsed, the particle will be considered dead and will not be rendered again.
   *
   * @type {number}
   * @memberof Particle
   */
  timeToLive: number;

  /**
   * An empty element that can be used when building custom animations. Used to save state on the object that will be carried between ticks
   *
   * @type {*}
   * @memberof Particle
   */
  animationState: any;

  /**
   * The number of milliseconds since the epoch representing the time this particle was spawned
   *
   * @type {number}
   * @memberof Particle
   */
  spawnTime: number;

  constructor(public position: { x: number, y: number }, private config: ParticleConfig) {
    // most of these properties can be either values or functions, if they're functions, call them and save the returned value
    // otherwise treat them as a value
    this.size = typeof this.config.size  === 'function' ? this.config.size() : this.config.size;
    this.vector = typeof this.config.vector  === 'function' ? this.config.vector() : this.config.vector;
    this.speed = typeof this.config.speed  === 'function' ? this.config.speed() : this.config.speed;
    this.color = typeof this.config.color  === 'function' ? this.config.color() : this.config.color;
    this.shape = typeof this.config.shape  === 'function' ? this.config.shape() : this.config.shape;
    this.timeToLive = typeof this.config.timeToLive  === 'function' ? this.config.timeToLive() : this.config.timeToLive;

    this.spawnTime = Date.now();
  }

  /**
   *  Move the particles according to its configuration and consider it dead if its optional timeToLive property has elapsed
   *
   * @memberof Particle
   */
  tick(): void {
    // if we passed in a custom animation, run it
    if (this.config.animation) {
      this.config.animation(this)
    } else {
      // otherwise, move the particle linearly on its vector
      this.calculateLinearMove();
    }

    if (this.timeToLive && Date.now() - this.spawnTime > this.timeToLive) {
      // if the particle's optional timeToLive property has elapsed, consider it dead
      this.dead = true;
    }
  };

  /**
   * Generate a new (x, y) value for the particle from its speed and vector
   *
   * @memberof Particle
   */
  calculateLinearMove() {
    this.position.x += Math.sin(this.vector * (Math.PI / 180)) * this.speed;
    this.position.y += Math.cos(this.vector * (Math.PI / 180)) * this.speed;
  }
}

/**
 * An enum with the possible shape values a Particle can have
 *
 * @export
 * @enum {number}
 */
export enum Shape {
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle'
}

/**
 * An interface for passing configuration to a Particle
 *
 * @export
 * @interface ParticleConfig
 */
export interface ParticleConfig {
  /**
   * An object containing the width and height of this particle. The height property is optional if rendering a Shape.CIRCLE
   * 
   * @type {{w: number, h: number} | () => {w: number, h: number}}
   * @memberof ParticleConfig
   */
  size: { w: number, h: number } | (() => { w: number, h: number });

  /**
   * A number controlling the speed of the particle. Translates to the number of pixels traversed by the pixel in a single tick
   * 
   * @type {number | () => number}
   * @memberof ParticleConfig
   */
  speed: number | (() => number);

  /**
   * A number representing the angle (in degrees) from the emitter that this particle should travel. 0 travels straight down from the emitter, 180 straight up.
   * Due to the nature of degrees, this number can be added to and subtracted from indefinitely. 0, 360, 720, 1080 will all travel straight down.
   * 
   * @type {number | () => number}
   * @memberof ParticleConfig
   */
  vector: number | (() => number);

  /**
   * A string prepresenting the color of this pixel
   * Can be in format 'black' or 'rgb(0, 0, 0)' or 'rgba(0, 0, 0, 1)'
   *
   * @type {string | () => string}
   * @memberof ParticleConfig
   */
  color: string | (() => string);

  /**
   * A string representing the shape of the particle. Can be either 'rectangle' or 'circle'
   *
   * @type {Shape | () => Shape}
   * @memberof ParticleConfig
   */
  shape: Shape | (() => Shape);

  /**
   * A function defining a custom animtion to replace the linear movement of the particle
   * 
   * @type {(Particle) => void}
   * @memberof ParticleConfig
   */
  animation?: (x: Particle) => void;
  
  /**
   * A number representing the number of milliseconds this particle should live. If specified, when that time has elapsed, the particle will be considered dead and will not be rendered again. 
   *
   * @type {number | () => number}
   * @memberof ParticleConfig
   */
  timeToLive?: number | (() => number);
}