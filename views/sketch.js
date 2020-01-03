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
let socket;
let revealedTime;
let timeSinceRevealed;
let playerLife;
let playerSize;
let camX;
let camY;
let camZ;

let planets = [];
let shells = [];
let trails = [];

function setup() {

  // Replace this with DOM sliders?
  G = 20;
  planetMin = 40;
  planetMax = 200;
  planetCount = 25;
  planetBuffer = 80;
  shellSize = 5;
  shellVelRatio = 0.02;
  shellVelHintSize = 6;
  shellAccHintSize = 150;
  trailLife = 500;
  explodeSize = 40;
  explodeLife = 500;
  aimPos = createVector(0, 0);
  revealedTime = 100;
  timeSinceRevealed = 0;
  playerSize = 5;
  playerLife = 2000;
  camX = 0;
  camY = 0;
  camZ = 1;

  // On the eighth day the gods created the canvas
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  noStroke();
  colorMode(HSB, 100);

  // Generate planets
  randomSeed(420);
  let packingWidth = windowWidth / 2;
  let packingHeight = windowHeight / 2;
  do {
    let p = new Planet(
      random(-packingWidth, packingWidth),
      random(-packingHeight, packingHeight),
      random(planetMin, planetMax)
    );

    // Only save the new planet if it is sutably far from existing planets
    let save = true;
    for (let i = 0; i < planets.length; i++) {
      if (p5.Vector.sub(p.pos, planets[i].pos).mag() < planets[i].size + p.size + planetBuffer) {
        save = false;
        packingWidth += 1;
        packingHeight += 1;
      }
    }

    if (save)
      planets.push(p);

  } while (planets.length < planetCount)

  // Connect to server
  socket = io.connect('https://space-tanks.herokuapp.com/');
  //socket = io.connect('http://localhost:3033');

  socket.on('newShell', function (shellData) {
    shells.push(new Shell(shellData.px, shellData.py, shellData.vx, shellData.vy, shellData.s));
  })

  socket.on('playerPosUpdate', function (playerPosData) {
    newTrail(playerPosData.px, playerPosData.py, playerSize, playerLife);
  })

}

function update() {

  // Update shells and trails and add new trails
  for (let i = 0; i < shells.length; i++) {
    newTrail(shells[i].pos.x, shells[i].pos.y, shellSize, trailLife);

    shells[i].update(planets);
  }
  for (let i = 0; i < trails.length; i++)
    trails[i].update();

  // Remove dead things
  let i = 0;
  while (i < shells.length) {
    if (shells[i].dead) {
      newTrail(shells[i].pos.x, shells[i].pos.y, explodeSize, explodeLife);
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

  // Marco!
  if ((timeSinceRevealed += deltaTime) > revealedTime) {
    timeSinceRevealed = 0.0;
    var x = camMX(mouseX);
    var y = camMY(mouseY);
    var playerPosData = {
      px: x,
      py: y
    }
    socket.emit('playerPosUpdate', playerPosData);
  }

  if (keyIsDown(87))//w
    camY -= 30;
  if (keyIsDown(65))//a
    camX -= 30;
  if (keyIsDown(83))//s
    camY += 30;
  if (keyIsDown(68))//d
    camX += 30;
  if (keyIsDown(107)) {//+
    console.log('minus')
    camZ /= 1.01;
  }
  if (keyIsDown(109)) {//-
    console.log('plus')
    camZ *= 1.01;
  }
}

function draw() {

  // Why no game loop?
  update();

  // Polo!
  if (timeSinceRevealed == 0.0)
    newTrail(camMX(mouseX), camMY(mouseY), playerSize, playerLife);

  // The background and planets and shells and trails and 'UI' oh my!
  background(0);
  for (i = 0; i < planets.length; i++)
    planets[i].draw();
  for (i = 0; i < shells.length; i++)
    shells[i].draw();
  for (i = 0; i < trails.length; i++)
    trails[i].draw();
}

function touchStarted() {
  return inputStart()
}

function mousePressed() {
  return inputStart()
}

function touchMoved() {
  return inputMove()
}

function mouseDragged() {
  return inputMove()
}

function inputStart() {
  aimPos.set(camMX(mouseX), camMY(mouseY));
  return false;
}

function inputMove() {
  let pos = createVector(camMX(mouseX), camMY(mouseY));
  let vel = p5.Vector.mult(p5.Vector.sub(aimPos, pos), shellVelRatio);
  newShell(aimPos.x, aimPos.y, vel.x, vel.y, shellSize);
  return false;
}

function newTrail(posX, posY, mySize, myLife) {
  trails.push(new Trail(posX, posY, mySize, myLife));
}

function newShell(posX, posY, velX, velY, size) {
  shells.push(new Shell(posX, posY, velX, velY, size));
  var shellData = {
    px: posX,
    py: posY,
    vx: velX,
    vy: velY,
    s: size
  }
  socket.emit('newShell', shellData);
}

function camTX(x) {
  return (x - camX + windowWidth / 2) / camZ;
}

function camTY(y) {
  return (y - camY + windowHeight / 2) / camZ;
}

function camMX(x) {
  return camX + x * camZ - windowWidth / 2;
}

function camMY(y) {
  return camY + y * camZ - windowHeight / 2;
}

function camSZ(s) {
  return s / camZ;
}

function reset() { }
