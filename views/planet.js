// Planets are pretty dumb
class Planet {

  constructor(minX, minY, maxX, maxY, minSize, maxSize) {
    this.pos = createVector(random(minX, maxX), random(minY, maxY));
    this.size = random(minSize, maxSize);
    this.color = color(random(0, 255), random(0, 255), random(0, 255));
  }

  update() {
    //nothing yet
  }

  draw() {
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size);
  }
}
