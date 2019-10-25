import { ParticleSystem } from './ParticleSystem';

export class ParticleScene {
  private running: boolean;
  context: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement, private systems: ParticleSystem[]) {
    this.context = this.canvas.getContext('2d');
    systems.map(system => system.deferTick = true);
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

  stop() {
    this.running = false;

    this.systems.map(system => {
      system.stop();
    });
  }

  tick() {
    if (this.running) {
      this.context.clearRect(0, 0, this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height);
      this.systems.map(system => system.tick());
      requestAnimationFrame(this.tick.bind(this))
    }
  }

}