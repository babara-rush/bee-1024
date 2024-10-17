import { Ammo } from "./ammo.js";
import { AudioControl } from './audio.js'

const FlyAngleRange = [[Math.PI * 3 / 4, Math.PI * 5 / 4], [-1 * Math.PI / 4, Math.PI / 4]];

export class Opponent {
  x;
  y;
  width = 100;
  height = 100;
  step = 50;
  image = new Image(this.width, this.height);
  boomImage = new Image();
  lastShootTime = 0;
  shootSpeed = 2000;
  ammo = [];
  imgLoaded = false;
  angle;
  lastFlyTime = 0;
  flyGap = 200;
  gap = 10;
  destroyed = false;
  dying = -1;
  lastDyingTime = 0;

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
      this.angle = -1 * this.angle;
      return;
    }
    if (isBottom) {
      this.angle = -1 * this.angle;
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
    if (this.destroyed) {
      ctx.clearRect(this.x, this.y, this.width, this.height);
      return;
    }
    if (time - this.lastFlyTime < this.flyGap) return;
    this.lastFlyTime = time;
    this.checkIsEdge(this.x, this.y);
    this.x = this.x + this.step * Math.cos(this.angle);
    this.y = this.y + this.step * Math.sin(this.angle);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  loadImage() {
    if (this.imgLoaded) return Promise.resolve();

    return Promise.all([
      new Promise(resolve => {
        this.image.onload = () => resolve();
        this.image.src = './enemy.png';
        this.imgLoaded = true;
      }),
      new Promise(resolve => {
        this.boomImage.onload = () => resolve();
        this.boomImage.src = "./explosion.png";
      })
    ]);
  }

  draw(ctx) {
    if (this.dying >= 8) {
      AudioControl.playExplosion()
      this.destroyed = true
      return
    }
    // dying state & play animation
    if (this.dying !== -1) {
      const delta = Date.now() - this.lastDyingTime;
      if (delta > 16) {
        ctx.drawImage(this.boomImage,
          64 * this.dying, 0,
          64, 64,
          this.x, this.y,
          this.width, this.height,
        );
        this.dying++;
        this.lastDyingTime = Date.now()
      }

      return
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collisionCheck(bee, ctx) {
    if (this.destroyed || this.dying !== -1) {
      return
    }
    const ammoPos = bee.ammo.findIndex(ammo => ammo.isHitBee(this));
    if (ammoPos != -1) {
      console.log('触发')
      bee.ammo.splice(ammoPos, 1)
      this.destroy()
    }
  }

  destroy() {
    this.lastDyingTime = Date.now();
    this.dying = 0;
    this.ammo = [];
  }

  drawAmmo(ctx) {
    if (this.destroyed) return;
    if (this.ammo.length === 0) return;
    this.ammo.forEach(item => {
      item.draw(ctx);
      item.fly();
    });
    this.ammo = this.ammo.filter(ammo => (ammo.y > 0 && ammo.y < window.innerHeight) || (ammo.x > 0 && ammo.x < window.innerWidth));
  }

  shoot(time, ctx) {
    if (this.destroyed) {
      ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    this.drawAmmo(ctx);
    if (!time || time - this.lastShootTime < this.shootSpeed) return;
    this.lastShootTime = time;
    this.ammo.push(new Ammo(this.x + (2 * this.width) / 3, this.y + this.height + 5, (Math.PI / 2)));
  }
}
