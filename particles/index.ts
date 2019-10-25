import { Emitter, EmitterConfig } from "./Emitter";
import { Particle, ParticleSystem, ParticleConfig, Shape } from "./systems/ParticleSystem";

interface ParticleSystemConfig {
  particle: ParticleConfig;
  emitter: EmitterConfig;
}

const defaultParticlesConfig: ParticleSystemConfig = {
  particle: {
    size: () => ({ w: random(6, 18), h: random(6, 18) }),
    speed: () =>  Math.floor(Math.random() * 18) + 12,
    vector: () => random(10, 80),
    color: () => `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`,
    shape: () => {
      return [Shape.CIRCLE, Shape.RECTANGLE][random(0, 1)]
    }
  },
  emitter: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    emissionFrequency: 100,
  }
}

window['Particles'] = (canvas: HTMLCanvasElement, config: ParticleSystemConfig = defaultParticlesConfig) => {
  const context = canvas.getContext('2d');
  const { width, height } = canvas.getBoundingClientRect();

  const emitter = new Emitter<Particle>(config.particle, config.emitter);
  const system = new ParticleSystem(emitter, context, width, height);

  system.start();

  return system;
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}