import Vector from './vector.js';
import { Ball, Box } from './entities.js';

export const INIT = 'INIT';
export const PAUSE = 'PAUSE';
export const SCORE = 'SCORE';
export const CONTROLS_UPDATE = 'CONTROLS_UPDATE';

const config = {
  hitForce: 1.1, // force to speed up the ball when it hits the paddle
  wallFriction: .1, // friction to slow down the when it hits the wall
  paddleMaxSpeed: 10, // max speed of the paddle
  paddleSpeedTransfer: .3, // percent of the paddle's speed transfered to the ball after a stroke
}

const state = {
  ctx: null,
  score: [0, 0],
  serving: null,
  paused: false,
}

const entities = [];

const controls = {
  dpad1: Vector.create(0, 0),
  dpad2: Vector.create(0, 0),
};

const debug = () => {
  const { ctx } = state;
  ctx.beginPath();
  entities.forEach(target => {
    const rect = target.getRect();
    ctx.fillStyle = 'rgba(250, 250, 0, 0.4)';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.moveTo(target.position.x, target.position.y);
    ctx.lineTo(target.position.x + target.velocity.x, target.position.y + target.velocity.y);
    ctx.stroke();
  });
  ctx.closePath();
}

const pause = () => {
  if (state.paused) {
    state.paused = false;
  } else {
    state.paused = true;
  }
  self.postMessage({ type: PAUSE, isPaused: state.paused });
}

const updateControls = ({ dpad1, dpad2 }) => {
  controls.dpad1.x = dpad1[0];
  controls.dpad1.y = dpad1[1];
  controls.dpad2.x = dpad2[0];
  controls.dpad2.y = dpad2[1];
}

const updateGame = (elapsedTime = 0) => {
  // # Skip if paused
  if (state.paused) return;

  // # Following the paddle when serving
  if (state.serving) {
    entities[1].velocity.y = controls.dpad1.y * config.paddleMaxSpeed;
    entities[2].velocity.y = controls.dpad2.y * config.paddleMaxSpeed;
    entities[1].position.addTo(entities[1].velocity);
    entities[2].position.addTo(entities[2].velocity);
    if (state.serving === 1) { // follow player 1 (left) paddle
      entities[0].position.x = entities[1].position.x + entities[0].r * 2;
      entities[0].position.y = entities[1].position.y;
    }
    if (state.serving === 2) { // follow player 2 (right) paddle
      entities[0].position.x = entities[2].position.x - entities[0].r * 2;
      entities[0].position.y = entities[2].position.y;
    }
    return;
  }

  const ctx = state.ctx;
  const ball = entities[0];
  const next = ball.position.add(ball.velocity);

  // # Paddle positions
  entities[1].velocity.y = controls.dpad1.y * config.paddleMaxSpeed;
  entities[2].velocity.y = controls.dpad2.y * config.paddleMaxSpeed;
  entities[1].position.addTo(entities[1].velocity);
  entities[2].position.addTo(entities[2].velocity);
  if (entities[1].position.y < entities[1].height / 2) {
    entities[1].velocity.y = 0;
    entities[1].position.y = entities[1].height / 2;
  }
  if (entities[2].position.y < entities[2].height / 2) {
    entities[2].velocity.y = 0;
    entities[2].position.y = entities[2].height / 2;
  }
  if (entities[1].position.y > ctx.canvas.height - entities[1].height / 2) {
    entities[1].velocity.y = 0;
    entities[1].position.y = ctx.canvas.height - entities[1].height / 2;
  }
  if (entities[2].position.y > ctx.canvas.height - entities[2].height / 2) {
    entities[2].velocity.y = 0;
    entities[2].position.y = ctx.canvas.height - entities[2].height / 2;
  }

  // # Paddle bouncing
  // Speed up the ball when hit the paddle
  const inersect = (p0, p1, p2, p3) => {
    const A1 = p1.y - p0.y;
    const B1 = p0.x - p1.x;
    const C1 = A1 * p0.x + B1 * p0.y;
    const A2 = p3.y - p2.y;
    const B2 = p2.x - p3.x;
    const C2 = A2 * p2.x + B2 * p2.y;
    const denominator = A1 * B2 - A2 * B1;

    if (denominator === 0) {
      return null;
    }

    const intersetX = (B2 * C1 - B1 * C2) / denominator;
    const intersetY = (A1 * C2 - A2 * C1) / denominator;
    const rx0 = (intersetX - p0.x) / (p1.x - p0.x);
    const ry0 = (intersetY - p0.y) / (p1.y - p0.y);
    const rx1 = (intersetX - p2.x) / (p3.x - p2.x);
    const ry1 = (intersetY - p2.y) / (p3.y - p2.y);

    if (((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
        ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
      return { x: intersetX, y: intersetY }
    }
  };

  const rect1 = entities[1].getRect();
  const rect2 = entities[2].getRect();
  rect1.x = rect1.x + rect1.width;
  const inersectPoint1 = inersect(ball.position, next, rect1, { x: rect1.x, y: rect1.y + rect1.height });
  const inersectPoint2 = inersect(ball.position, next, rect2, { x: rect2.x, y: rect2.y + rect2.height });

  if (inersectPoint1) {
    ball.position.x = inersectPoint1.x + ball.r;
    ball.velocity.x = ball.velocity.x * -1 * config.hitForce;
    ball.velocity.y = ball.velocity.y  + entities[1].velocity.y * config.paddleSpeedTransfer;
    ball.position.addTo(ball.velocity);
    return;
  }
  if (inersectPoint2) {
    ball.position.x = inersectPoint2.x - ball.r;
    ball.velocity.x = ball.velocity.x * -1 * config.hitForce;
    ball.velocity.y = ball.velocity.y + entities[2].velocity.y * config.paddleSpeedTransfer;
    ball.position.addTo(ball.velocity);
    return;
  }

  // # Walls bouncing
  // Slow down the ball when hit the wall
  if(next.x > ctx.canvas.width - ball.r || next.x < ball.r) {
    ball.position.x = (next.x < ball.r) ? ball.r : ctx.canvas.width - ball.r;
    ball.velocity.x = ball.velocity.x * -.9;

    if (next.x < ball.r) {
      state.score[1]++;
    } else {
      state.score[0]++;
    }
    self.postMessage({ type: SCORE, score: state.score });
    return serve({ player: (next.x < ball.r) ? 2 : 1 });
  }
  else if(next.y > ctx.canvas.height - ball.r || next.y < ball.r) {
    ball.position.y = (next.y < ball.r) ? ball.r : ctx.canvas.height - ball.r;
    ball.velocity.y = ball.velocity.y * -.9;
  }

  ball.position.addTo(ball.velocity);
}

const render = (time) => {
  state.ctx.clearRect(0, 0, state.ctx.canvas.width, state.ctx.canvas.height);
  // ctx.fillStyle = 'rgba(44, 62, 80, .9)';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateGame();
  entities.forEach(entity => { entity.render(state.ctx) });
  // debug();
  requestAnimationFrame(render);
}

const serve = ({ player }) => {
  const max = 5;
  const min = -5;
  const velocityX = 7;
  const velocityY = Math.random() * (max - min + 1) + min;
  state.serving = player;

  setTimeout(() => {
    entities[0].velocity.x = (player === 2) ? -velocityX : velocityX;
    entities[0].velocity.y = velocityY;
    state.serving = null;
  }, 500);
}

const init = ({ canvas }) => {
  state.ctx = canvas.getContext("2d");
  state.ctx.imageSmoothingEnabled = false;
  state.isPaused = true;

  entities[0] = Ball.create({ position: Vector.create(700, 400), r: 10 });
  entities[1] = Box.create({ position: Vector.create(20, 400), width: 20, height: 100 });
  entities[2] = Box.create({ position: Vector.create(1380, 400), width: 20, height: 100 });

  serve({ player: 1 })
  requestAnimationFrame(render);
}

self.addEventListener('message', (e) => {
  switch (e.data.type) {
    case INIT:
      return init({ config: e.data.config, canvas: e.data.canvas });
    case PAUSE:
      return pause();
    case CONTROLS_UPDATE:
      return updateControls({ dpad1: e.data.dpad1, dpad2: e.data.dpad2 });
  }
});
