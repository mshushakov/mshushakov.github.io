import Vector from './vector.js';
import Gamepad from './gamepad.js';
import { Ball, Box } from './entities.js';

export const INIT = 'INIT';
export const PAUSE = 'PAUSE';
export const SCORE = 'SCORE';
// export const SCORE = 'SCORE';

const config = {
  hitForce: 1.1,
  wallFriction: .1,
  paddleMaxSpeed: 10,
}

const state = {
  score: [0, 0],
  isPaused: false,
  gampad: {
    dpad1: Vector.create(0, 0),
    dpad2: Vector.create(0, 0)
  },
}

const init = ({ canvas }) => {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const entities = [];

  const debug = () => {
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

  const render = (time) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(44, 62, 80, .9)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    update();
    entities.forEach(entity => { entity.render(ctx) });
    // debug();
    requestAnimationFrame(render);
  }

  const update = (elapsedTime = 0) => {
    // # Walls bouncing
    // Slow down the ball when hit the wall
    const ball = entities[0];
    const next = ball.position.add(ball.velocity);

    if(next.x > ctx.canvas.width - ball.r || next.x < ball.r) {
      ball.position.x = (next.x < ball.r) ? ball.r : ctx.canvas.width - ball.r;
      ball.velocity.x = ball.velocity.x * -.9;

      if (next.x < ball.r) {
        state.score[1]++;
      } else {
        state.score[0]++;
      }
      self.postMessage({ type: SCORE, score: state.score });
    }
    else if(next.y > ctx.canvas.height - ball.r || next.y < ball.r) {
      ball.position.y = (next.y < ball.r) ? ball.r : ctx.canvas.height - ball.r;
      ball.velocity.y = ball.velocity.y * -.9;
    }

    // # Paddle positions
    entities[1].velocity.y = state.gampad.dpad1.y * config.paddleMaxSpeed;
    entities[2].velocity.y = state.gampad.dpad2.y * config.paddleMaxSpeed;
    entities[1].position.addTo(entities[1].velocity);
    entities[2].position.addTo(entities[2].velocity);
    if (entities[1].position.y < entities[1].height / 2) {
      entities[1].position.y = entities[1].height / 2;
    }
    if (entities[2].position.y < entities[2].height / 2) {
      entities[2].position.y = entities[2].height / 2;
    }
    if (entities[1].position.y > ctx.canvas.height - entities[1].height / 2) {
      entities[1].position.y = ctx.canvas.height - entities[1].height / 2;
    }
    if (entities[2].position.y > ctx.canvas.height - entities[2].height / 2) {
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
      ball.velocity.addTo(entities[1].velocity.multiply(.2));
    }
    if (inersectPoint2) {
      ball.position.x = inersectPoint2.x - ball.r;
      ball.velocity.x = ball.velocity.x * -1 * config.hitForce;
      ball.velocity.addTo(entities[2].velocity.multiply(.2));
    }

    ball.position.addTo(ball.velocity);
  }

  entities[0] = Ball.create({ position: Vector.create(500, 200), velocity: Vector.create(5, 2), r: 10 });
  entities[1] = Box.create({ position: Vector.create(20, 400), width: 20, height: 100 });
  entities[2] = Box.create({ position: Vector.create(1380, 400), width: 20, height: 100 });

  requestAnimationFrame(render);
}

const pause = () => {
  if (state.isPaused) {
    state.isPaused = false;
  } else {
    state.isPaused = true;
  }
  self.postMessage({ type: PAUSE, isPaused: state.isPaused });
}

self.addEventListener('message', (e) => {
  switch (e.data.type) {
    case INIT:
      return init({ config: e.data.config, canvas: e.data.canvas });
    case PAUSE:
      return pause();
    case 'change______':
      state.gampad.dpad1 = e.data.dpad1;
      state.gampad.dpad2 = e.data.dpad2;
      return
  }
});
