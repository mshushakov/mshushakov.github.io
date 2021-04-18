import Vector from './vector.js';

export class Ball {
  position = Vector.create(0, 0);
  velocity = Vector.create(0, 0);
  r = 100;

  render = (ctx) => {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
  }

  getRect = () => {
    return {
      x: this.position.x - this.r,
      y: this.position.y - this.r,
      width: this.r * 2,
      height: this.r * 2,
    }
  }

  static create({ position, velocity, r = 0 }) {
    const ball = new Ball();
    ball.r = r;
    if (position) ball.position.addTo(position);
    if (velocity) ball.velocity.addTo(velocity);
    return ball;
  }
}

export class Box {
  position = Vector.create(0, 0);
  velocity = Vector.create(0, 0);
  width = 10;
  height = 10;

  render = (ctx) => {
    ctx.beginPath();
    ctx.rect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
  }
  update = (ctx) => {
    this.position.addTo(this.velocity);
    if (this.position.x < this.width / 2) {
      this.position.x = this.width / 2 + 1;
    }
    if (this.position.x > ctx.canvas.width - this.width / 2) {
      this.position.x = ctx.canvas.width - this.width / 2
    }
  }
  getRect = () => {
    return {
      x: this.position.x - this.width / 2,
      y: this.position.y - this.height / 2,
      width: this.width,
      height: this.height,
    }
  }
  hitTest = (target) => {
    const rect1 = this.getRect();
    const rect2 = target; // target.getRect();
    return (rect1.x <= rect2.x + rect2.width &&
            rect1.x + rect1.width >= rect2.x &&
            rect1.y <= rect2.y + rect2.height &&
            rect1.y + rect1.height >= rect2.y)
  }

  static create({position, velocity, width = 0, height = 0 }) {
    const box = new Box();
    box.width = width;
    box.height = height;
    if (position) box.position.addTo(position);
    if (velocity) box.velocity.addTo(velocity);
    return box;
  }
}
