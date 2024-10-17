import {Ammo} from "./ammo.js";

const FlyAngleRange = [[Math.PI * 3 / 4, Math.PI * 5 / 4], [-1 * Math.PI / 4, Math.PI / 4]];

export class Opponent {
  x;
  y;
  width = 100;
  height = 100;
  step = 50;
  image = new Image(this.width, this.height);
  lastShootTime = 0;
  shootSpeed = 2000;
  ammo = [];
  imgLoaded = false;
  angle;
  lastFlyTime = 0;
  flyGap = 200;
  gap = 10

  constructor(x, y) {
    this.x = x;
    this.y = y;
    const direction = Math.random() > 0.5 ? 0 : 1;
    this.angle = Math.random() * (FlyAngleRange[direction][1] - FlyAngleRange[direction][0]) + FlyAngleRange[direction][0];
  }

  checkIsEdge(x, y) {
    const isTop = y + this.height >= window.innerHeight - this.gap;
    const isLeft = x <= this.gap;
    const isRight = x + this.width >= window.innerWidth - this.gap;
    const isBottom = y <= this.gap;
    if (isTop && isLeft) {
      if (this.angle >= Math.PI) {
        this.angle = this.angle - Math.PI;
      } else {
        this.angle = this.angle + Math.PI;
      }
      return;
    }
    if (isTop && isRight) {
      if (this.angle >= Math.PI) {
        this.angle = this.angle - Math.PI;
      } else {
        this.angle = this.angle + Math.PI;
      }
      return;
    }
    if (isBottom && isLeft) {
      if (this.angle >= Math.PI) {
        this.angle = this.angle - Math.PI;
      }
      else {
        this.angle = this.angle + Math.PI;
      }
      return;
    }
    if (isBottom && isRight) {
      if (this.angle >= Math.PI) {
        this.angle = this.angle - Math.PI;
      }
      else {
        this.angle = this.angle + Math.PI;
      }
      return;
    }
    if (isTop) {
      this.angle =  -1 * this.angle;
      return;
    }
    if (isBottom) {
      this.angle =  -1 * this.angle;
      return;
    }
    if (isLeft) {
      this.angle = Math.PI - this.angle;
      return;
    }
    if (isRight) {
      this.angle = Math.PI - this.angle;
    }

  }

  fly(time, ctx) {
    if (time - this.lastFlyTime < this.flyGap) return;
    this.lastFlyTime = time;
    this.checkIsEdge(this.x, this.y);
    this.x = this.x + this.step * Math.cos(this.angle);
    this.y = this.y + this.step * Math.sin(this.angle);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  loadImage() {
    if(this.imgLoaded) return Promise.resolve();
    return new Promise(resolve => {
      this.image.src = './bee.jpeg';
      this.imgLoaded = true;
      this.image.onload = () => resolve();
    })
  }

  destroy() {}

  drawAmmo(ctx) {
    if (this.ammo.length === 0) return;
    this.ammo.forEach(item => {
      item.draw(ctx);
      item.fly();
    });
    this.ammo = this.ammo.filter(ammo => (ammo.y > 0 && ammo.y < window.innerHeight) || (ammo.x > 0 && ammo.x < window.innerWidth));
  }

  shoot(time, ctx) {
    this.drawAmmo(ctx);
    if (!time || time - this.lastShootTime < this.shootSpeed) return;
    this.lastShootTime = time;
    this.ammo.push(new Ammo(this.x + (2 * this.width) / 3, this.y + this.height + 5,  (Math.PI / 2)));
  }
}
