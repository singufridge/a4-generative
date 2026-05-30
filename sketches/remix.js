// =============================================
// remix.js — your combined sketch
// This is where sketch1 and sketch2 come together
// into something new
// =============================================

var circleA, circleB;

// * added interactive colour changer
var lineCol = 359;
var colChangeRate = 5;

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      lineCol -= colChangeRate;
      if (lineCol < 0) { lineCol += 359; }
      break;
    case "ArrowUp":
      lineCol += colChangeRate;
      if (lineCol > 359) { lineCol -= 359; }
      break;
  }
});

// * added reset function
function canvasReset() {
  clear();
}

function setup() {
  createCanvas(500, 500);
  frameRate(30);
  circleA = new Circle(150, 150, 80);
  circleB = new Circle(150, 150, 110);
  noStroke();
  background(245);
}

function draw() {
  circleA.update();
  circleB.update();
  intersect(circleA, circleB);
}

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
    return; // no solution 
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