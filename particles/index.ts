import { Emitter, EmitterConfig } from "./Emitter";
import { ParticleSystem, ParticleSystemOptions } from "./ParticleSystem";
import {  ParticleConfig, Shape } from './Particle';
import { ParticleScene } from './Scene';

/**
 * An interface that contains the configuration for a Particle, an Emitter, and any additional options for a ParticleSystem
 *
 * @export
 * @interface ParticleSystemConfig
 */
export interface ParticleSystemConfig {
  /**
   * The configuration for the type of Particle a system will emit
   *
   * @type {ParticleConfig}
   * @memberof ParticleSystemConfig
   */
  particle: ParticleConfig;

  /**
   * The configuration for a System's Emitter
   *
   * @type {EmitterConfig}
   * @memberof ParticleSystemConfig
   */
  emitter: EmitterConfig;

  /**
   * Any additional system-specific configuration
   *
   * @type {ParticleSystemOptions}
   * @memberof ParticleSystemConfig
   */
  systemOptions?: ParticleSystemOptions;
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

/**
 * Creates a new ParticleScene with the provided canvas
 *
 * @param {HTMLCanvasElement} canvas the canvas for which the ParticleScene to direct
 * @param {...ParticleSystem[]} systems an optional array of ParticleSystems with which to initialize the ParticleScene
 * @returns {ParticleScene}
 */
export function CreateParticleScene(canvas: HTMLCanvasElement, ...systems: ParticleSystem[]): ParticleScene {
  return new ParticleScene(canvas, systems);
}

/**
 * Creates a new ParticleSystem from the provided ParticleSystemConfig
 *
 * @export
 * @param {ParticleSystemConfig} [config=defaultParticlesConfig]
 * @returns
 */
export function CreateParticleSystem (config: ParticleSystemConfig = defaultParticlesConfig) {
  const emitter = new Emitter(config.particle, config.emitter);
  const system = new ParticleSystem(emitter, config.systemOptions);

  return system;
}

// Add the two above exports to the Window object to be accessed in browser or outside a Node.js environment
window['CreateParticleSystem'] = CreateParticleSystem;
window['CreateParticleScene'] = CreateParticleScene;

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