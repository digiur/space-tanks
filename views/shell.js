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

    // This is an artifact
    //drawX and drawY can be removed
    let drawX = this.pos.x;
    let drawY = this.pos.y;

    // Draw body
    fill("White");
    circle(camTX(drawX), camTY(drawY), camSZ(this.size));

    // Draw hint lines
    stroke("Red");
    line(camTX(drawX), camTY(drawY), camTX(drawX) + this.acc.x * camSZ(shellAccHintSize), camTY(drawY) + this.acc.y * camSZ(shellAccHintSize));

    stroke("Blue");
    line(camTX(drawX), camTY(drawY), camTX(drawX) + this.vel.x * camSZ(shellVelHintSize), camTY(drawY) + this.vel.y * camSZ(shellVelHintSize));

    noStroke();
  }
}
