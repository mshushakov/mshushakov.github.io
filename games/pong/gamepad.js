import Vector from './vector.js';

class Gamepad {
  static #instance = null;
  #dpad1 = Vector.create(0, 0);
  #dpad2 = Vector.create(0, 0);

  get dpad1() {
    const gamepad = navigator.getGamepads()[0];
    return gamepad ? Vector.create(gamepad.axes[1], gamepad.axes[0]) : this.#dpad1;
  }

  get dpad2() {
    const gamepad = navigator.getGamepads()[1];
    return gamepad ? Vector.create(gamepad.axes[1], gamepad.axes[0]) : this.#dpad1;
  }

  #init() {
    // window.addEventListener("gamepadconnected", (e) => {
    //   console.log("Gamepad connected from index %d: %s",
    //     e.gamepad.index, e.gamepad.id,
    //     e.gamepad.buttons.length, e.gamepad.axes.length);
    //   this.#gp = e.gamepad; // navigator.getGamepads()[e.gamepad.index];
    //   console.log(this.#gp)
    // });
    // window.addEventListener("gamepaddisconnected", (e) => {
    //   console.log("Gamepad disconnected from index %d: %s",
    //     e.gamepad.index, e.gamepad.id,
    //     e.gamepad.buttons.length, e.gamepad.axes.length);
    //   this.#gp = e.gamepad; // navigator.getGamepads()[e.gamepad.index];
    //   console.log(this.#gp)
    // });
    document.addEventListener('keydown', (e) => {
      if (e.key == 'd') this.#dpad1.x = 1;
      if (e.key == 'a') this.#dpad1.x = -1;
      if (e.key == 'w') this.#dpad1.y = -1;
      if (e.key == 's') this.#dpad1.y = 1;

      if (e.key == 'ArrowRight') this.#dpad2.x = 1;
      if (e.key == 'ArrowLeft') this.#dpad2.x = -1;
      if (e.key == 'ArrowUp') this.#dpad2.y = -1;
      if (e.key == 'ArrowDown') this.#dpad2.y = 1;
    }, false);
    document.addEventListener('keyup', (e) => {
      if (e.key == 'd') this.#dpad1.x = 0;
      if (e.key == 'a') this.#dpad1.x = 0;
      if (e.key == 'w') this.#dpad1.y = 0;
      if (e.key == 's') this.#dpad1.y = 0;

      if (e.key == 'ArrowRight') this.#dpad2.x = 0;
      if (e.key == 'ArrowLeft') this.#dpad2.x = 0;
      if (e.key == 'ArrowUp') this.#dpad2.y = 0;
      if (e.key == 'ArrowDown') this.#dpad2.y = 0;
    }, false);
  }

  // static create() {
  //   if (this.#instance) return this.#instance;

  //   this.#instance = new Gamepad();
  //   this.#instance.#init();
  //   return this.#instance;
  // }
}

export default Gamepad;
