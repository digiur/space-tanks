// Planets are pretty dumb
class Planet {

  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.size = size;
    this.color = color(random(0, 100), random(50, 100), random(25, 75));
  }

  update() {
    //nothing yet
  }

  draw() {
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size);
  }
}
