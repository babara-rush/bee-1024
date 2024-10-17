import {Opponent} from "./opponent.js";
import {Bee} from "./bee.js";

export class Control {
  context;
  bee;
  opponentCount = 10;
  opponentCol = 5;
  opponent = []

  constructor(context) {
    this.context = context;
    this.bee = new Bee();
    const row = this.opponentCount / this.opponentCol;
    const [startX, startY] = [window.innerWidth / 2 - (this.opponentCol * 100) / 2, 40];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < this.opponentCol; j++) {
        this.opponent.push(new Opponent(startX + j * 120, startY + i * 120));
      }
    }
  }

  async draw(time) {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    await Promise.all([this.bee.loadImage(), ...this.opponent.map(opponent => opponent.loadImage())])
    this.drawPlayer();
    this.drawOpponent();
    this.bee.shoot(time, this.context);
    this.opponent.forEach(opponent => opponent.fly(time, this.context));
    this.opponent.forEach(opponent => opponent.shoot(time, this.context));
  }

  drawPlayer() {
    this.context.drawImage(this.bee.image, this.bee.x, this.bee.y, this.bee.width, this.bee.height);
  }

  drawOpponent() {
    this.opponent.forEach(opponent => {
      this.context.drawImage(opponent.image, opponent.x, opponent.y, opponent.width, opponent.height);
    });
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
