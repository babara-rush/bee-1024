export class Ammo {
  width = 4;
  height = 10;
  speed = 5;
  angle = - Math.PI / 2;
  color = 'red';

  constructor(x, y, angle, speed, color) {
    this.x = x;
    this.y = y;
    angle && (this.angle = angle);
    speed && (this.speed = speed);
    color && (this.color = color);
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.closePath();
  }

  fly() {
    this.x = this.x + this.speed * Math.cos(this.angle);
    this.y = this.y + this.speed * Math.sin(this.angle);
  }
}
