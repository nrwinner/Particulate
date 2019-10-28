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
  highlightElement.style = `transform: translateX(${event.srcElement.offsetLeft}px)`
}

const skyBoxEmitter = {
  x: 0,
  y: 0,
  width: 600,
  height: 0,
  emitPerTick: 1,
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

  const config = {
    emitter: {
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      emitPerTick: 1,
      numberOfEmissions: 100,
    },
    particle: {
      size: () => ({ w: random(2, 3), h: random(2, 3) }),
      speed: () => random(6, 10),
      shape: 'circle',
      color: 'black',
      vector: () => random(0, 360),
      animation: (p) => {
        if (!p.animationState) {
          p.animationState = { tickCount: 0, direction: [-1, 1][random(0, 1)] };
        }

        if (p.animationState.tickCount >= 35) {
          p.animationState.direction *= -1;
          p.animationState.tickCount = 5;
        } else if (p.animationState.tickCount >= 5) {
          p.vector += (12 * p.animationState.direction);
        }

        p.animationState.tickCount++;

        p.calculateLinearMove();
      }
    },
    systemOptions: { startAtTick: 100 }
  }

  canvas.style.backgroundColor = 'white';

  scene = CreateParticleScene(canvas); 
  scene.addSystem(CreateParticleSystem(config));
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
  scene.addSystem(CreateParticleSystem(config));
  scene.start();
}



function activateSnow() {
  const snowParticle = {
    size: () => { return { w: random(1, 2) } },
    speed: () =>  random(1, 4),
    vector: 20,
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
    emitter: skyBoxEmitter,
    systemOptions: { startAtTick: 200 }
  }

  const skyBoxEmitter2 = Object.assign({}, skyBoxEmitter);
  skyBoxEmitter2.width = 0;
  skyBoxEmitter2.height = 600;
  skyBoxEmitter2.emitPerTick = 1;
  skyBoxEmitter2.emissionFrequency = 50;

  const config2 = {
    particle: snowParticle,
    emitter: skyBoxEmitter2,
    systemOptions: { startAtTick: 100 }
  }

  scene = CreateParticleScene(canvas); 
  scene.addSystem(CreateParticleSystem(config));
  scene.addSystem(CreateParticleSystem(config2));
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
  
  scene.addSystem(CreateParticleSystem(burstConfig)); 
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}