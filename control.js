import { Opponent } from "./opponent.js";
import { Bee } from "./bee.js";

export class Control {
  context;
  bee;
  opponentCount = 5;
  opponentCol = 10;
  opponent = [];
  isGameOver = false;
  isSuccess = false;

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

  fail() {
    const result = document.querySelector('#result');
    const fail = document.querySelector('#fail');
    const failBtn = document.querySelector('#fail-button');
    result.setAttribute('data-show', 'true')
    fail.setAttribute('data-show', 'true')
    failBtn.setAttribute('data-show', 'true')
    failBtn.addEventListener('click', () => {
      window.location.reload();
    })
  }

  success() {
    const result = document.querySelector('#result');
    const success = document.querySelector('#success');
    const successBtn = document.querySelector('#success-button');
    result.setAttribute('data-show', 'true')
    success.setAttribute('data-show', 'true')
    successBtn.setAttribute('data-show', 'true')
    successBtn.addEventListener('click', () => {
      window.location.reload();
    })
  }

  async draw(time) {
    if (this.isGameOver) {
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.fail();
      return;
    }
    if (this.isSuccess) {
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.success();
      return;
    }
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    await Promise.all([this.bee.loadImage(), ...this.opponent.map(opponent => opponent.loadImage())])
    this.drawPlayer();
    this.drawOpponent();
    this.bee.shoot(time, this.context);
    this.opponent.forEach(opponent => opponent.fly(time, this.context));
    this.opponent.forEach(opponent => opponent.shoot(time, this.context));
    this.opponent.forEach(opponent => opponent.collisionCheck(this.bee, this.context));
    if (this.bee.isHit(this.opponent)) {
      this.isGameOver = true;
    }
    if (this.opponent.every(opponent => opponent.destroyed)) {
      this.isSuccess = true;
    }
  }

  drawPlayer() {
    this.context.drawImage(this.bee.image, this.bee.x, this.bee.y, this.bee.width, this.bee.height);
  }

  drawOpponent() {
    this.opponent = this.opponent.filter(opponent => !opponent.destroyed)
    this.opponent.forEach(opponent => {
      // this.context.drawImage(opponent.image, opponent.x, opponent.y, opponent.width, opponent.height);
      opponent.draw(this.context);
    });
  }

  addLeftEvent() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'a'].includes(e.key)) {
        this.bee.toLeft();
      }
      if (['ArrowRight', 'd'].includes(e.key)) {
        this.bee.toRight();
      }
    });
  }
}
