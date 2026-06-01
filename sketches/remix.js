// =============================================
// remix.js — your combined sketch
// This is where sketch1 and sketch2 come together
// into something new
// =============================================

// * sketch 1 declarations
var circleA, circleB;

// * added interactive colour changer
var lineCol = 359;
var colChangeRate = 5;

// * sketch 2 declarations
let ball;
let speedInput;
let gravityInp;
let elasticityToggle;
let audioContext;
let canvasWidth;
let canvasHeight;
const bounceThreshold = 0.05;

// * gravity changer -- sketch 2
// When keys pressed, either increase or decrease gravity
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      ball.gravity -= 0.1;
      gravityInp.value(ball.gravity.toFixed(1));
      break;
    case "ArrowUp":
      ball.gravity += 0.1;
      gravityInp.value(ball.gravity.toFixed(1));
      break;
    case "r":
      clear();
      background(245);
      break;
  }
});

// * added reset function
function canvasReset() {
  clear();
}

function setup() {
  createCanvas(600, 600);
  background(245);

  // * sketch 1 setup
  circleA = new Circle(150, 150, 80);
  circleB = new Circle(150, 150, 110);
  noStroke();

  // * sketch 2 setup
  ball = {
    x: width / 2,
    y: height / 3,
    radius: 5,
    dx: 5,
    dy: 5,
    gravity: 0.1,
    elasticity: 0.8,
    useGravity: true,
    useElasticity: true
  };

  /* Was distracting so I took it out
  speedInput = createInput('5', 'number');
  speedInput.position(width / 2 - 30, height + 30);
  speedInput.attribute('step', '0.1');
  speedInput.changed(() => updateSpeed(speedInput.value()));
  speedInput.attribute('disabled', '');
  */

  createP('Gravitational Pull:');
  gravityInp = createInput(ball.gravity, 'number');
  gravityInp.attribute('disabled', '');
  
  createP('');
  elasticityToggle = createCheckbox('Elasticity', true);
  elasticityToggle.changed(() => toggleElasticity(elasticityToggle.checked()));
  
  checkDisabled();
}

function draw() {
  // * sketch 1
  circleA.update();
  circleB.update();
  intersect(circleA, circleB);

  // * sketch 2
  drawBall();
  updateBall();
}

// ***** SKETCH 1 FUNCTIONS *****

function Circle(px, py, pr) { 
  this.x = px;
  this.y = py;
  this.r = pr;
  this.r2 = this.r * this.r;
  this.xspeed = random(-4, 4);
  this.yspeed = random(-4, 4);
  this.xdir = 1;
  this.ydir = -1;

  this.update = function() {

    this.x += this.xspeed * this.xdir;
    if (this.x > width - this.r || this.x < this.r) {
      this.xdir = this.xdir * -1;
    }

    this.y += this.yspeed * this.ydir;
    if (this.y > width - this.r || this.y < this.r) {
      this.ydir = this.ydir * -1;
    }

  }
}

function intersect(cA, cB) {

  var dx = cA.x - cB.x;
  var dy = cA.y - cB.y;
  var d2 = dx * dx + dy * dy;
  var d = sqrt(d2);

  if ((d > cA.r + cB.r) || (d < abs(cA.r - cB.r))) {
    return;
  }

  var a = (cA.r2 - cB.r2 + d2) / (2 * d);
  var h = sqrt(cA.r2 - a * a);
  var x2 = cA.x + a * (cB.x - cA.x) / d;
  var y2 = cA.y + a * (cB.y - cA.y) / d;

  var paX = x2 + h * (cB.y - cA.y) / d;
  var paY = y2 - h * (cB.x - cA.x) / d;
  var pbX = x2 - h * (cB.y - cA.y) / d;
  var pbY = y2 + h * (cB.x - cA.x) / d;

  // * unused code
  // var randCol = Math.floor(Math.random() * 358); //added random colour generation

  stroke(`hsl(${lineCol}, 70%, 50%)`);
  line(paX, paY, pbX, pbY);

}

// ***** SKETCH 2 FUNCTIONS *****

function drawBall() {
  fill('#ffffff00');
  stroke(`hsla(${lineCol}, 50%, 50%, 0.30)`); // ball colour also changes with lines
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

    lineCol += colChangeRate;
    if (lineCol > 359) { lineCol -= 359; }
  }
  if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy * (ball.useElasticity ? ball.elasticity : 1);
    ball.y = ball.y + ball.radius > height ? height - ball.radius : ball.radius;
    if (Math.abs(ball.dy) > bounceThreshold) {
      lineCol += colChangeRate; // when the ball gets within a certain threshold of the edges, change colour of strokes
      if (lineCol > 359) { lineCol -= 359; }
    }
  }

  // * added ball interactivity
  let d = dist(mouseX, mouseY, ball.x, ball.y);
  if (d < ball.radius && mouseIsPressed) {
    ball.x = mouseX;
    ball.y = mouseY;
  }
}

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
  }
}

/* Commented out to remove speed input and window resizing
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
*/