/*
todo:
worldgen based on windowsize
work on phones (needs worldgen first)
decouple pixels to units - probs in game library
decouple time and frames - def in game library
user input for perameters
*/
let G;
let planetMin;
let planetMax;
let planetCount;
let planetBuffer;
let shellSize;
let shellVelRatio;
let shellVelHintSize;
let shellAccHintSize;
let trailLife;
let explodeSize;
let explodeLife;
let aimPos;

let planets = [];
let shells = [];
let trails = [];

function setup() {

  // On the eighth day the gods created the canvas
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Replace this with DOM sliders
  G = 20;
  planetMin = 40;
  planetMax = 100;
  planetCount = 10;
  planetBuffer = 20;
  shellSize = 5;
  shellVelRatio = 0.02;
  shellVelHintSize = 6;
  shellAccHintSize = 150;
  trailLife = 500;
  explodeSize = 40;
  explodeLife = 250;
  aimPos = createVector(0, 0);

  // Generate planets
  do {
    let p = new Planet(planetMax, planetMax, windowWidth - planetMax, windowHeight - planetMax, planetMin, planetMax);
    let save = true;

    // Only save the new planet if it is sutably far from existing planets
    for (let i = 0; i < planets.length; i++)
      if (p5.Vector.sub(p.pos, planets[i].pos).mag() < planets[i].size + p.size + planetBuffer)
        save = false;
    if (save)
      planets.push(p);

  } while (planets.length < planetCount)
}

function update() {

  // Update shells and trails and add new trails
  for (let i = 0; i < shells.length; i++) {
    trails.push(new Trail(shells[i].pos.x, shells[i].pos.y, shellSize, trailLife, color("White")));
    shells[i].update(planets);
  }
  for (let i = 0; i < trails.length; i++)
    trails[i].update();

  // Remove dead things
  let i = 0;
  while (i < shells.length) {
    if (shells[i].dead) {
      trails.push(new Trail(shells[i].pos.x, shells[i].pos.y, explodeSize, explodeLife, color("Red")));
      shells.splice(i, 1);
      continue;
    }
    i++
  }
  i = 0;
  while (i < trails.length) {
    if (trails[i].dead) {
      trails.splice(i, 1);
      continue;
    }
    i++
  }
}

function draw() {

  // Why no game loop?
  update();

  // The background and planets and shells and trails and 'UI' oh my!
  background(0);
  for (i = 0; i < planets.length; i++)
    planets[i].draw();
  for (i = 0; i < shells.length; i++)
    shells[i].draw();
  for (i = 0; i < trails.length; i++)
    trails[i].draw();
  if (mouseIsPressed) {
    stroke(255, 255, 255);
    line(aimPos.x, aimPos.y, mouseX, mouseY);
    noStroke();
  }
}

function touchStarted() {
  inputStart()
}

function mousePressed() {
  inputStart()
}

function touchMoved() {
  inputMove()
}

function mouseDragged() {
  inputMove()
}

function inputStart() {
  aimPos.set(mouseX, mouseY);
  return false;
}

function inputMove() {
  let pos = createVector(mouseX, mouseY)
  let vel = p5.Vector.mult(p5.Vector.sub(aimPos, pos), shellVelRatio);
  shells.push(new Shell(aimPos.x, aimPos.y, vel.x, vel.y, shellSize));
  return false;
}

function reset() {}
