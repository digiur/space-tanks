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
let gameWidth;
let gameHeight;
let socket;
let revealedTime;
let timeSinceRevealed;
let playerLife;
let playerSize;

let planets = [];
let shells = [];
let trails = [];

function setup() {

  // Replace this with DOM sliders?
  G = 20;
  planetMin = 75;
  planetMax = 75;
  planetCount = 3;
  planetBuffer = 40;
  shellSize = 5;
  shellVelRatio = 0.02;
  shellVelHintSize = 6;
  shellAccHintSize = 150;
  trailLife = 500;
  explodeSize = 40;
  explodeLife = 500;
  aimPos = createVector(0, 0);
  gameWidth = 1000;//windowWidth;
  gameHeight = 1000;//windowHeight;
  revealedTime = 100;
  timeSinceRevealed = 0;
  playerSize = 5;
  playerLife = 2000;

  // On the eighth day the gods created the canvas
  createCanvas(gameWidth, gameHeight);
  noStroke();
  colorMode(HSB, 100);

  // Generate planets
  planets.push(new Planet(250, 150, 100));
  planets.push(new Planet(125, 225, 60));
  planets.push(new Planet(400, 300, 80));
  planets.push(new Planet(600, 700, 40));
  planets.push(new Planet(700, 600, 40));
  planets.push(new Planet(500, 500, 120));
  // do {
  //   let p = new Planet(planetMax, planetMax, gameWidth - planetMax, gameHeight - planetMax, planetMin, planetMax);
  //   let save = true;

  //   // Only save the new planet if it is sutably far from existing planets
  //   for (let i = 0; i < planets.length; i++)
  //     if (p5.Vector.sub(p.pos, planets[i].pos).mag() < planets[i].size + p.size + planetBuffer)
  //       save = false;
  //   if (save)
  //     planets.push(p);

  // } while (planets.length < planetCount)

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
    var playerPosData = {
      px: mouseX,
      py: mouseY,
    }
    socket.emit('playerPosUpdate', playerPosData);
  }

}

function draw() {

  // Why no game loop?
  update();

  // Polo!
  if (timeSinceRevealed == 0.0)
    newTrail(mouseX, mouseY, playerSize, playerLife);

  // The background and planets and shells and trails and 'UI' oh my!
  background(0);
  for (i = 0; i < planets.length; i++)
    planets[i].draw();
  for (i = 0; i < shells.length; i++)
    shells[i].draw();
  for (i = 0; i < trails.length; i++)
    trails[i].draw();
  if (mouseIsPressed) {
    stroke("White");
    line(aimPos.x, aimPos.y, mouseX, mouseY);
    noStroke();
  }
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
  aimPos.set(mouseX, mouseY);
  return false;
}

function inputMove() {
  let pos = createVector(mouseX, mouseY)
  let vel = p5.Vector.mult(p5.Vector.sub(aimPos, pos), shellVelRatio);
  newShell(aimPos.x, aimPos.y, vel.x, vel.y, shellSize);
  return false;
}

function newTrail(posX, posY, mySize, myLife) {
  trails.push(new Trail(posX, posY, mySize, myLife));
  // var data = {
  //   x: posX,
  //   y: posY,
  //   size: mySize,
  //   life: myLife
  // }
  // socket.emit('newTrail', data);
}

function newShell(posX, posY, velX, velY, size) {
  shells.push(new Shell(posX, posY, velX, velY, size));
  var shellData = {
    px: posX,
    py: posY,
    vx: velX,
    vy: velY,
    s: size,
  }
  socket.emit('newShell', shellData);
}

function reset() { }
