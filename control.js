import {Bee} from "./bee.js";

export class Control {
  context;
  bee

  constructor(context, bee) {
    this.context = context;
    this.bee = bee;
  }

  generateOpponent() {}

  draw(time) {
    this.drawPlayer();
    this.bee.shoot(time, this.context);
  }

  drawPlayer() {
    this.context.drawImage(this.bee.image, this.bee.x, this.bee.y, this.bee.width, this.bee.height);
  }

  addLeftEvent() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.bee.toLeft();
      }
      if (e.key === 'ArrowRight') {
        this.bee.toRight();
      }
    });
  }
}
