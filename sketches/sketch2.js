// =============================================
// sketch2.js — your second source sketch
// Paste your source sketch code here and start hacking
// =============================================

//building off of https://pastebin.com/YfLuwFVz

let ball;
let speedInput;
let gravityInp;
let elasticityToggle;
let audioContext;
let canvasWidth;
let canvasHeight;
const bounceThreshold = 0.05;  

function setup() {
  canvasWidth = window.innerWidth * 0.9;
  canvasHeight = window.innerHeight * 0.7;
  createCanvas(canvasWidth, canvasHeight);
  ball = {
    x: width / 2,
    y: height / 3,
    radius: 35,
    dx: 5,
    dy: 5,
    gravity: 0.1,
    elasticity: 0.8,
    useGravity: true,
    useElasticity: true
  };
  //audioContext = new (window.AudioContext || window.webkitAudioContext)();

  speedInput = createInput('5', 'number');
  speedInput.position(width / 2 - 30, height + 30);
  speedInput.attribute('step', '0.1');
  speedInput.changed(() => updateSpeed(speedInput.value()));
  speedInput.attribute('disabled', '');

  createP('Gravitational Pull:');
  /*
  //gravityInp = createCheckbox('Gravity', true);
  gravityInp = createInput('', '')
  // gravityInp.input(isNumber);
  gravityInp.changed(() => updateGravity(gravityInp.value()));
  */

  gravityInp = createInput(ball.gravity, 'number');
  gravityInp.attribute('disabled', '');
  
  createP('');
  elasticityToggle = createCheckbox('Elasticity', true);
  elasticityToggle.changed(() => toggleElasticity(elasticityToggle.checked()));
  
  checkDisabled();
}

// * function to only accept numbers in form
/*
function isNumber() {
  let s = this.value();
  let c = s.charCodeAt(s.length - 1);

  if (!(c > 47 && c < 58)) {
    this.value(s.substring(0,s.length-1));
  } 
}
  */

function draw() {
  background(238);
  drawBall();
  updateBall();
}

function drawBall() {
  fill('#0095DD');
  noStroke();
  ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
}

function updateBall() {
  if (ball.useGravity) {
    ball.dy += ball.gravity;
  }
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    ball.x = ball.x + ball.radius > width ? width - ball.radius : ball.radius;
    //playSound(400 + Math.random() * 200, Math.abs(ball.dx));
  }
  if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy * (ball.useElasticity ? ball.elasticity : 1);
    ball.y = ball.y + ball.radius > height ? height - ball.radius : ball.radius;
    if (Math.abs(ball.dy) > bounceThreshold) {
      //playSound(400 + Math.random() * 200, Math.abs(ball.dy));
    }
  }

  // * added ball interactivity
  let d = dist(mouseX, mouseY, ball.x, ball.y);
  if (d < ball.radius && mouseIsPressed) {
    ball.x = mouseX;
    ball.y = mouseY;
  }
}


// * removed sound from original code
/*
function playSound(frequency = 440, volume = 1) {
  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  let now = audioContext.currentTime;
  let attack = 0.01;
  let decay = 0.2;
  let sustain = 0.1;
  let release = 0.2;

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + attack);
  gainNode.gain.linearRampToValueAtTime(sustain * volume, now + attack + decay);
  gainNode.gain.setValueAtTime(sustain * volume, now + attack + decay + 0.1); // Hold sustain for a short time
  gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + 0.1 + release);

  oscillator.start(now);
  oscillator.stop(now + attack + decay + 0.1 + release);

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
}
*/

function updateGravity(val) {
  ball.gravity = val;
}

function toggleElasticity(checked) {
  ball.useElasticity = checked;
  checkDisabled();
}

function checkDisabled() {
  if (!ball.useGravity && !ball.useElasticity) {
    speedInput.removeAttribute('disabled');
  } else {
    speedInput.attribute('disabled', '');
    speedInput.value(sqrt(ball.dx * ball.dx + ball.dy * ball.dy).toFixed(1));
  }
}

function updateSpeed(value) {
  ball.dx = parseFloat(value);
  ball.dy = parseFloat(value);
}

function windowResized() {
  resizeCanvas(window.innerWidth * 0.9, window.innerHeight * 0.7);
  if (ball.x + ball.radius > width) {
    ball.x = width - ball.radius;
  }
  if (ball.y + ball.radius > height) {
    ball.y = height - ball.radius;
  }
}