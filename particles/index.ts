import { Emitter, EmitterConfig } from "./Emitter";
import { ParticleSystem, ParticleConfig, Shape } from "./ParticleSystem";
import { ParticleScene } from './Scene';

interface ParticleSystemConfig {
  particle: ParticleConfig;
  emitter: EmitterConfig;
}

const defaultParticlesConfig: ParticleSystemConfig = {
  particle: {
    size: () => ({ w: random(6, 13), h: random(6, 13) }),
    speed: () =>  random(14, 18),
    vector: () => random(25, 65),
    color: () => `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`,
    shape: () => {
      return [Shape.CIRCLE, Shape.RECTANGLE][random(0, 1)]
    },
  },
  emitter: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    emitPerTick: 20,
    maxLivingParticles: 20
  }
}

const CreateParticleScene = (canvas: HTMLCanvasElement, ...systems: ParticleSystem[]): ParticleScene => {
  return new ParticleScene(canvas, systems);
}

const CreateParticleSystem = (canvas: HTMLCanvasElement, config: ParticleSystemConfig = defaultParticlesConfig) => {
  const context = canvas.getContext('2d');
  const { width, height } = canvas.getBoundingClientRect();

  const emitter = new Emitter(config.particle, config.emitter);
  const system = new ParticleSystem(emitter, context, width, height);

  return system;
}

window['CreateParticleSystem'] = CreateParticleSystem;
window['CreateParticleScene'] = CreateParticleScene;

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}