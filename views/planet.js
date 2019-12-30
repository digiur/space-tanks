// Planets are pretty dumb
class Planet {

  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.size = size;
    this.color = color(random(0, 100), random(50, 100), random(25, 75));
  }

  draw() {
    fill(this.color);
    circle(camTX(this.pos.x), camTY(this.pos.y), camSZ(this.size));
  }
}
