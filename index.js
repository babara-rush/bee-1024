import { Control } from "./control.js";

const canvas = document.querySelector('#game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
ctx.lineCap = 'round';
let control

function init() {
  control = new Control(ctx);
  control.addLeftEvent();
  draw();
}

function draw(time = 0) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  control.draw(time);
  requestAnimationFrame(draw);
}

window.onload = () => {
  init()
}
