let canvas;
let system;

const rainParticle = {
  size: { w: 1, h: 5 },
  speed: () =>  Math.floor(Math.random() * 18) + 10,
  vector: 0,
  color: 'white',
  shape: 'line'
}

const snowParticle = {
  size: () => { return { w: random(1, 2) } },
  speed: () =>  random(2, 4),
  vector: 0,
  color: 'white',
  shape: 'circle'
}

const skyBoxEmitter = {
  x: 0,
  y: 0,
  width: 600,
  height: 0,
  emitPerTick: 2,
}

function onload() {
  canvas = document.getElementById('particles');

  activateDefault();
}

function pause() {
  system.stop() 
}

function play() {
  system.start();
}

function activateDefault() {
  if (system) {
    system.stop();
  }

  canvas.style.backgroundColor = 'white';

  system = Particles(canvas);

  system.start();
}

function activateRain() {
  if (system) {
    system.stop();
  }

  canvas.style.backgroundColor = 'black';

  let config = {
    particle: rainParticle,
    emitter: skyBoxEmitter
  }

  system = Particles(canvas, config);

  system.start();
}

function activateSnow() {
  if (system) {
    system.stop();
  }

  canvas.style.backgroundColor = 'black';

  const config = {
    particle: snowParticle,
    emitter: skyBoxEmitter
  }

  system = Particles(canvas, config);

  system.start();
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}