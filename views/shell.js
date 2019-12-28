class Shell {

  constructor(x, y, vx, vy, shellSize) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.force = createVector(0, 0);
    this.size = shellSize;
    this.dead = false;
  }

  update(planets) {
    this.doPhysics(planets);
    this.doCollisions(planets);
  }

  doPhysics(planets) {

    // Aggregate forces from planets
    this.force.set(0, 0);
    for (let i = 0; i < planets.length; i++)
      this.force.add(this.getForce(planets[i]));

    // "Do physics"
    this.acc.set(this.force.div(this.size));
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  getForce(planet) {
    // Force due to gravity = (G * m1 * m2) / (r * r)
    // in the direction of the source of gravity
    let dir = p5.Vector.sub(planet.pos, this.pos).normalize();
    return dir.mult((G * this.size * planet.size) / p5.Vector.sub(this.pos, planet.pos).magSq());
  }

  doCollisions(planets) {
    for (let i = 0; i < planets.length; i++)
      if (this.collideSq(planets[i]))
        this.dead = true;
  }

  collide(planet) {
    if (p5.Vector.sub(this.pos, planet.pos).mag() < planet.size / 2 + this.size / 2)
      return true
    else
      return false;
  }

  collideSq(planet) {
    // Using the square of the magnitude avoids a square root calculation
    let r1 = planet.size / 2;
    let r2 = this.size / 2;
    if (p5.Vector.sub(this.pos, planet.pos).magSq() < (r1 + r2) * (r1 + r2))
      return true
    else
      return false;
  }

  draw() {

    // Display the shell on the edge of the screen if offscreen
    let drawX = this.pos.x;
    let drawY = this.pos.y;

    if (drawX < 0)
      drawX = 0;
    else if (drawX > windowWidth)
      drawX = windowWidth;

    if (drawY < 0)
      drawY = 0;
    else if (drawY > windowHeight)
      drawY = windowHeight;

    // Draw body
    fill(color("white"));
    circle(drawX, drawY, this.size);

    // Draw hint lines
    stroke("Red");
    line(drawX, drawY, drawX + this.acc.x * shellAccHintSize, drawY + this.acc.y * shellAccHintSize);

    stroke("Blue");
    line(drawX, drawY, drawX + this.vel.x * shellVelHintSize, drawY + this.vel.y * shellVelHintSize);

    noStroke();
  }
}