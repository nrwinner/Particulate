import { ParticleSystem } from './ParticleSystem';

export class ParticleScene {
  running: boolean;
  context: CanvasRenderingContext2D;

  private hasStarted: boolean;

  constructor(private canvas: HTMLCanvasElement, private systems: ParticleSystem[]) {
    this.context = this.canvas.getContext('2d');

    if (systems) {
      for (let system of systems) {
        this.addSystem(system);
      }
    }
  }

  start() {
    if (!this.running) {
      this.systems.map(system => {
        system.start();
      });

      this.running = true;
  
      requestAnimationFrame(this.tick.bind(this));

      this.hasStarted = true;
    }
  }

  addSystem(s: ParticleSystem) {
    // config before adding system
    s.context = this.context;

    const { width, height } = this.canvas.getBoundingClientRect();
    s.canvasSize = { w: width, h: height };

    // now add system to array of systems
    this.systems.push(s);

    // if the scene is already running, start the new system
    if (this.running) {
      s.start();
    }
  }

  stop() {
    this.running = false;

    // for system in scene, stop system
    this.systems.map(system => {
      system.stop();
    });
  }

  tick() {
    if (this.running) {
      this.context.clearRect(0, 0, this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height);

      const livingSystems: ParticleSystem[] = [];

      for (let system of this.systems) {
        if (!system.dead && system.running) {
          system.tick();
          livingSystems.push(system);
        } else {
          system.stop();
        }
      }

      this.systems = livingSystems;

      requestAnimationFrame(this.tick.bind(this))
    }
  }

}