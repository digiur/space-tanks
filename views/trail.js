class Trail {

  constructor(x, y, size, life) {
    this.pos = createVector(x, y);
    this.size = size;
    this.life = life;
    this.age = 0;
    this.dead = false;
    this.color = color(0, 100, 50);
  }

  update() {
    // The life of a trail
    this.age += deltaTime;
    if (this.age < this.life) {
      this.color = color(this.age / this.life * 100, 100, 50);
    } else {
      this.dead = true;
    }
  }

  draw() {
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size);
  }
}