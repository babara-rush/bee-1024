import { Ammo } from './ammo.js';
import { AudioControl } from './audio.js';
export class Bee {
  x;
  y;
  width = 100;
  height = 100;
  step = 50;
  image = new Image(this.width, this.height);
  lastShootTime = 0;
  shootSpeed = 500;
  ammo = [];
  imgLoaded = false;

  constructor() {
    this.x = window.innerWidth / 2 - this.width / 2;
    this.y = window.innerHeight - this.height;
  }

  loadImage() {
    if (this.imgLoaded) return Promise.resolve();
    return new Promise(resolve => {
      this.image.src = './character.png';
      this.imgLoaded = true;
      this.image.onload = () => resolve();
    })
  }

  drawAmmo(ctx) {
    this.ammo.forEach(ammo => {
      ammo.draw(ctx);
      ammo.fly();
    });
    this.ammo = this.ammo.filter(ammo => (ammo.y > 0 && ammo.y < window.innerHeight) || (ammo.x > 0 && ammo.x < window.innerWidth));
  }

  toLeft() {
    if (this.x <= 0) return;
    this.x = this.x - this.step;
  }

  toRight() {
    if (this.x + this.width >= window.innerWidth) return;
    this.x = this.x + this.step;
  }

  shoot(time, ctx) {
    this.drawAmmo(ctx);
    if (time - this.lastShootTime < this.shootSpeed) return;
    this.lastShootTime = time;
    this.ammo.push(new Ammo(this.x + this.width / 3, this.y + 5));
    this.ammo.push(new Ammo(this.x + (2 * this.width) / 3, this.y + 5));
    AudioControl.playShoot()
  }

  isHit(bees) {
    return bees.some(item => {
      if (item.destroyed) return false;
      return item.ammo.some(ammo => ammo.isHitBee(this));
    })
  }
}
