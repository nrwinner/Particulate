let canvas;
let scene;

function toggleControls() {
  const el = document.getElementsByClassName('controls')[0];
  if (!el.classList.contains('controls--visible')) {
    el.classList.add('controls--visible');
  } else {
    el.classList.remove('controls--visible');
  }
}

function toggleParticleSystem(event) {
  document.getElementsByClassName('particle-switcher__button--active')[0].classList.remove('particle-switcher__button--active');
  event.srcElement.classList.add('particle-switcher__button--active');
  const highlightElement = document.getElementsByClassName('particle-switcher__highlight')[0];
  highlightElement.style = `transform: translateX(${event.srcElement.offsetLeft}px); width: ${event.srcElement.offsetWidth}px`
}

const skyBoxEmitter = {
  x: 0,
  y: 0,
  width: 900,
  height: 0,
  emitPerTick: 2,
}

function onload() {
  canvas = document.getElementById('particles');

  activateDefault();
}

function pause() {
  if (scene) {
    scene.stop();
  }
}

function play() {
  if (scene) {
    scene.start();
  }
}



function activateDefault() {
  if (scene) {
    scene.stop();
    canvas.removeEventListener('click', canvasClickHandler);
  }

  canvas.style.backgroundColor = 'white';

  scene = CreateParticleScene(canvas); 
  scene.addSystem(CreateParticleSystem(canvas));
  scene.start();
}



function activateRain() {

  const rainParticle = {
    size: { w: 1, h: 5 },
    speed: () =>  Math.floor(Math.random() * 18) + 10,
    vector: 0,
    color: 'white',
    shape: 'line'
  }

  if (scene) {
    scene.stop();
    canvas.removeEventListener('click', canvasClickHandler);
  }

  canvas.style.backgroundColor = 'black';

  let config = {
    particle: rainParticle,
    emitter: skyBoxEmitter
  }

  scene = CreateParticleScene(canvas); 
  scene.addSystem(CreateParticleSystem(canvas, config));
  scene.start();
}



function activateSnow() {
  const snowParticle = {
    size: () => { return { w: random(1, 2) } },
    speed: () =>  random(2, 4),
    vector: 0,
    color: 'white',
    shape: 'circle',
  }

  if (scene) {
    scene.stop();
    canvas.removeEventListener('click', canvasClickHandler);
  }

  canvas.style.backgroundColor = 'black';

  const config = {
    particle: snowParticle,
    emitter: skyBoxEmitter
  }

  scene = CreateParticleScene(canvas); 
  scene.addSystem(CreateParticleSystem(canvas, config));
  scene.start();
}



function activateCanvasClick() {
  if (scene) {
    scene.stop();
    canvas.removeEventListener('click', canvasClickHandler);
  }
  
  canvas.style.backgroundColor = 'white';

  scene = CreateParticleScene(canvas);
  scene.start();
  
  
  canvas.addEventListener('click', canvasClickHandler);
}

function canvasClickHandler(event) {

  const burstConfig = {
    emitter: {  
      x: event.pageX - event.currentTarget.getBoundingClientRect().left,
      y: event.pageY - event.currentTarget.getBoundingClientRect().top,
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
        if (!p.animationState) {
          let [r, g, b, a] = p.color.match(/[0-9]*/g).map(x => parseInt(x)).filter(x => !Number.isNaN(x));

          p.animationState = { r, g, b, a };
          p.animationState.vector = p.vector;
          p.animationState.direction = [-1, 1][random(0, 1)];
        } else {
          p.animationState.a -= 0.02;
          p.animationState.vector = p.animationState.vector + (5 * p.animationState.direction);

          p.color = `rgba(${p.animationState.r}, ${p.animationState.g}, ${p.animationState.b}, ${p.animationState.a})`
          p.vector = p.animationState.vector;
        }

        if (p.animationState.a <= 0) {
          p.dead = true;
        }

        p.calculateLinearMove();
      }
    }
  }
  
  scene.addSystem(CreateParticleSystem(canvas, burstConfig)); 
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}