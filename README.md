# In-Browser Particle System
A modular, extendable particle system built with :heart: using Typescript.

## Running the Example Project
Running the application requires [Node.js](https://nodejs.org). After cloning the repository, simply run `npm install` and then run `npm start`.

If you're planning to make changes to the code base, the system comes with nodemon already installed. Instead of running `npm start`, run `npm run serve`. This will build the application and host it at `localhost:8080` every time a file is changed.

**Note: When selecting the Particle Burst animation, click anywhere on the canvas to see the simulation.**


## Using the library

### In the browser
Using this particle system is easy. In the `<head>` of your HTML, import the `bundle.js` file from the dist folder.

```html
	<script src="particles/dist/bundle.js" type="text/javascript" />
```

### In a TypeScript or Node.js Project
If you're in a Typescript or Node.js project, you can utilize the TypeScript or non-bundled JavaScript files and import directly from the index script.

```javascript
	import { CreateParticleScene, CreateParticleSystem } from './particles/index'
```

### Emitting your first particles
This script exposes several functions. Full API documentation is below, but here is a quick guide for getting started.

```javascript
const canvas = document.getElementByTagName('canvas')[0];
const particleScene = CreateParticleScene(canvas);

const system = CreateParticleSystem();
scene.addSystem(system);

scene.start();
```

This code will create a ParticleSystem and ParticleScene, add the system to the scene, and start the scene. By default, the ParticleSystem creates an emitter in the upper-left corner of the canvas and emits in pulses a number of colored particles towards the lower-right corner of the canvas. Each system can be configured to do almost anything. More information on this configuration is in the API Documentation section.

## System Hierarchy
The particle system is made up of 4 basic types: The ParticleScene, the ParticleSystem, the Emitter, and the Particle. Each of these types build off of one another.

### Particle
The `Particle` is the smallest part of the system. It is responsible for maintaining its own shape, size, color, vector, etc. 

### Emitter
The Emitter` is the next step up the ladder. An emitter is responsible for determining if particles can be generated and then attempting to create them.

### ParticleSystem
The `ParticleSystem` is what connects an `Emitter` with a type of `Particle`. The `ParticleSystem` is responsible for adding, removing, and maintaining a list of `Particles`.

### ParticleScene
The largest unit of the system, the `ParticleScene` is responsible for adding, removing, and maintaining a list of `ParticleSystems`.


# Methodology
Each `ParticleSystem` is entirely self-contained. Alongside its `Emitter` and `Particle` configuration, it is responsible only for its own particles. A `ParticleScene` is the way in which we can add multiple self-contained systems to the same canvas.

# API Documentation

## ParticleConfig
| Property | Description  |
|--|--|
| size | An object of format `{ w: number, h: number }` detailing the size of the particle. **Note: the height parameter is not required if the particle is a circle.** |
| speed | A number (or a function that returns a number) specifying the number of pixels a particle will move in a single tick |
| vector | A number representing the angle (in degrees) away from the Emitter the particle should move. `0` travels straight down from the emitter, `180` straight up. **Note: Due to the nature of degrees, this number can be added to and subtracted from indefinitely. `0`, `360`, `720`, `1080` will all travel straight down.** |
| color | A string representing the color of the particle. Can be in format `'black'`, `'rgb(0, 0, 0)'`, or `'rgba(0, 0, 0, 1)'` |
| shape | A string (either `circle` or `rectangle` that dictates the shape of the particle |
| animation | An optional function that takes a particle as a parameter and returns `void`. Used for building custom animations. For more information, see the Building Custom Animations section below. |
| timeToLive | An optional parameter specifying the amount of time in milliseconds a particle will live. If specified, when that time has elapsed, the particle will be considered dead and will not be rendered again |

## ParticleSystemOptions
| Property | Description |
| -- | -- |
| startAtTick | An optional numerical parameter that instructs the particle system to fast forward to a specific tick without animating and then begin animating from that point. **Note: This will cause some amount delay between starting a scene and the first tick being rendered, since the system needs to fast forward all particles before rendering. Use with caution.**  |

## EmitterConfig

| Property | Description |
| -- | -- |
| x | A number specifying the x-coordinate of the Emitter |
| y | A number specifying the y-coordinate of the Emitter |
| width | A number specifying the width of the Emitter |
| height | A number specifying the height of the Emitter |
| numberOfEmissions | An optional number specifying the total number of emissions an Emitter will emit before being considered dead.
| emissionFrequency | An optional number from `1` to `100` specifying the frequency at which the Emitter will emit new particles. This parameter causes the Emitter to skip a number of ticks in between emissions. `1` is the least frequent, `100` is the most frequent. |
| maxLivingParticles | The total number of particles that can be alive from an Emitter at any given time. **Note: If an Emitter attempts to emit and is blocked by the maxLivingParticles property, it will attempt to emit every tick following that until successful, regardless of emissionFrequency.** |
| emitPerTick | An optional number (or function that returns a number) that dictates how many particles are emitted in a single tick. | 

# Creating a Custom Particle System
Using the above configuration, it's easy to create your own Particle System. 

```javascript
// create the emitter config
const skyBoxEmitter = {
	x: 0,
	y: 0,
	width: 900,
	height: 0,
	emitPerTick: 5,
}

// create the particle config
const rainParticle = {
	size: { w: 1, h: 5 },
	speed: () => Math.floor(Math.random() * 18) + 10,
	vector: 0,
	color: 'white',
	shape: 'line'
}

// pass the particle and emitter configs into a new config object
// instruct the system to fast-forward 200 ticks before rendering
let config = {
	particle:rainParticle,
	emitter: skyBoxEmitter,
	systemOptions: { startAtTick: 200 }
}

const scene = CreateParticleScene(canvas);
scene.addSystem(CreateParticleSystem(config));
scene.start();
```

See what this code makes [here](https://imgur.com/a/Yu5dvZm).


# Building Custom Animations
Let's face it: straight lines are boring. But fear not, you can program your own custom animations for your particles. We can pass a function in the `animation` property of the ParticleConfig and define our own animations through code.  We'll leverage the `animationState` property of the Particle class to manage state between ticks in the animation.

*For the purposes of the below code, `random` is a function that takes an inclusive lower-bound and an inclusive upper-bound and returns a random number between them.*

```javascript
const burstConfig = {
	emitter: {
		x: 200,
		y: 200,
		width: 0,
		height: 0,
		numberOfEmissions: 1,
		emitPerTick: () => random(6, 20)
	},
	particle: {
		size: () => ({ w: random(2, 5) }),
		speed: () => random(5, 10),
		vector: () => random(0, 360),
		color: () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 1)`,
		shape: 'circle',
		animation: (p) => {
			
			// if we haven't yet set the `animationState` property of this particle, do so now with the appropriate config
			if (!p.animationState) {
				let [r, g, b, a] = p.color.match(/[0-9]*/g).map(x => parseInt(x)).filter(x => !Number.isNaN(x));
				
				// save the color information we just parsed for future ticks
				p.animationState = { r, g, b, a };
				
				// get a random number that is either -1 or 1 to use as a direction for rotation
				p.animationState.direction = [-1, 1][random(0, 1)];
			} else {
				// fade the particle out with each tick
				p.animationState.a -= 0.02;
				p.color = `rgba(${p.animationState.r}, ${p.animationState.g}, ${p.animationState.b}, ${p.animationState.a})`
				
				// add 5 to the particle's vector to create a circular movement
				p.vector += (5 * p.animationState.direction);
			}	

			if (p.animationState.a <= 0) {
				// if the particle is completely transparent, remove it
				p.dead = true;
			}
			
			// now that we've processed the particle, we can call the calculateLinearMove function
			// to have the particle move on its new vector normally
			p.calculateLinearMove();
		}
	}
}

const scene = CreateParticleScene(canvas);
scene.start();

setInterval(() => {
	scene.addSystem(CreateParticleSystem(burstConfig));
}, 1000)
```

See what this code makes [here](https://imgur.com/a/werSHp6).

