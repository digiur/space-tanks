class Trail {

  constructor(x, y, size, life, myColor) {
    this.pos = createVector(x, y);
    this.size = size;
    this.life = life;
    this.startColor = myColor;
    this.endColor = color(0, 0, 0);
    this.color = myColor;
    this.age = 0;
    this.dead = false;
  }

  update() {
    // The life of a trail
    this.age += deltaTime;
    if (this.age < this.life) {
      this.color = lerpColor(this.startColor, this.endColor, this.age / this.life);
    } else {
      this.dead = true;
    }
  }

  draw() {
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size);
  }
}