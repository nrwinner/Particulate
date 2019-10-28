import { ParticleSystem } from './ParticleSystem';

/**
 * A class for controlling a list of ParticleSystems rendered to the same canvas. Automatically removes dead systems.
 *
 * @export
 * @class ParticleScene
 */
export class ParticleScene {
  /**
   * True if the scene is actively running
   *
   * @type {boolean}
   * @memberof ParticleScene
   */
  running: boolean;

  /**
   * The context this scene will provide to each of its systems to render particles
   *
   * @type {CanvasRenderingContext2D}
   * @memberof ParticleScene
   */
  context: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement, private systems: ParticleSystem[]) {
    this.context = this.canvas.getContext('2d');

    if (systems) {
      for (let system of systems) {
        this.addSystem(system);
      }
    }
  }
  
  /**
   * Start all systems in the scene and begin the main animation loop
   *
   * @memberof ParticleScene
   */
  start() {
    // do nothing if the scene is already running
    if (!this.running) {
      // iterate each of the scene's systems and start them
      this.systems.map(system => {
        system.start();
      });

      this.running = true;
      
      // start the main ParticleScene loop
      requestAnimationFrame(this.tick.bind(this));
    }
  }

  /**
   * Add a new ParticleSystem to the Scene, provide it with configuration from the Scene, and start it iff the Scene itself is running
   *
   * @param {ParticleSystem}
   * @memberof ParticleScene
   */
  addSystem(s: ParticleSystem) {
    // provide the system with the context of the scene's canvas
    s.context = this.context;

    // provide the system with the width and height of the scene's canvas
    const { width, height } = this.canvas.getBoundingClientRect();
    s.canvasSize = { w: width, h: height };

    // now add system to array of systems
    this.systems.push(s);

    // if the scene is already running, start the new system
    if (this.running) {
      s.start();
    }
  }

  /**
   * Stop all ParticleSystems in the scene
   *
   * @memberof ParticleScene
   */
  stop() {
    this.running = false;

    // for each system in scene, stop system
    this.systems.map(system => {
      system.stop();
    });
  }

  /**
   * Ticks each particle system and remove dead systems
   *
   * @memberof ParticleScene
   */
  tick() {
    // do nothing is scene isn't running
    if (this.running) {
      // clear the canvas to render the next frame
      this.context.clearRect(0, 0, this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height);

      // array to hold living systems, we'll replace this.systems with it later to avoid modifying the list we're iterating
      const livingSystems: ParticleSystem[] = [];

      for (let system of this.systems) {
        // for each system, if it's not dead and running, tick the system and add it to list of living systems
        if (!system.dead && system.running) {
          system.tick();
          livingSystems.push(system);
        } else {
          // otherwise, stop the system before it's removed
          system.stop();
        }
      }

      // reset this.systems to remove any dead systems
      this.systems = livingSystems;

      requestAnimationFrame(this.tick.bind(this))
    }
  }

}