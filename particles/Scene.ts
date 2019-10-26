import { ParticleSystem } from './ParticleSystem';

export class ParticleScene {
  private running: boolean;
  context: CanvasRenderingContext2D;

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
    }
  }

  addSystem(s: ParticleSystem) {
    this.systems.push(s);

    if (this.running) {
      s.start();
    }
  }

  stop() {
    this.running = false;

    this.systems.map(system => {
      system.stop();
    });
  }

  tick() {
    if (this.running) {
      this.context.clearRect(0, 0, this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height);

      const livingSystems: ParticleSystem[] = [];

      for (let system of this.systems) {
        if (!system.dead && system.status) {
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