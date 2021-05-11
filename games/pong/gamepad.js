export default class Gamepad {
  dpad1 = [0, 0];
  dpad2 = [0, 0];

  init() {
    const scanGamepadsState = () => {
      const gamepads = navigator.getGamepads();
      const { dpad1, dpad2 } = this;

      if (gamepads[0]) {
        if (gamepads[0].id.includes('Joy-Con (L)')) {
          dpad1[0] = gamepads[0].axes[1];
          dpad1[1] = gamepads[0].axes[0];
        }
        else if (gamepads[0].id.includes('Joy-Con (R)')) {
          dpad2[0] = gamepads[0].axes[1];
          dpad2[1] = gamepads[0].axes[0] * -1;
        }
        else if (gamepads[0].id.includes('Joy-Con L+R')) {
          dpad1[0] = gamepads[0].axes[0];
          dpad1[1] = gamepads[0].axes[1];
          dpad2[0] = gamepads[0].axes[2];
          dpad2[1] = gamepads[0].axes[3];
        }
      } else if (gamepads[1]) {
        if (gamepads[1].id.includes('Joy-Con (L)')) {
          dpad1[0] = gamepads[1].axes[0];
          dpad1[1] = gamepads[1].axes[1];
        }
        else if (gamepads[1].id.includes('Joy-Con (R)')) {
          dpad2[0] = gamepads[1].axes[0];
          dpad2[1] = gamepads[1].axes[1];
        }
      }

      const event = new CustomEvent('gamepadupdated', { detail: { dpad1, dpad2 }});
      dispatchEvent(event);
      requestAnimationFrame(scanGamepadsState);
    };

    window.addEventListener('keydown', (e) => {
      const { dpad1, dpad2 } = this;
      if (e.key == 'd') dpad1[0] = 1;
      if (e.key == 'a') dpad1[0] = -1;
      if (e.key == 'w') dpad1[1] = -1;
      if (e.key == 's') dpad1[1] = 1;
      if (e.key == 'ArrowRight') dpad2[0] = 1;
      if (e.key == 'ArrowLeft') dpad2[0] = -1;
      if (e.key == 'ArrowUp') dpad2[1] = -1;
      if (e.key == 'ArrowDown') dpad2[1] = 1;
    }, false);
    window.addEventListener('keyup', (e) => {
      const { dpad1, dpad2 } = this;
      if (e.key == 'd') dpad1[0] = 0;
      if (e.key == 'a') dpad1[0] = 0;
      if (e.key == 'w') dpad1[1] = 0;
      if (e.key == 's') dpad1[1] = 0;
      if (e.key == 'ArrowRight') dpad2[0] = 0;
      if (e.key == 'ArrowLeft') dpad2[0] = 0;
      if (e.key == 'ArrowUp') dpad2[1] = 0;
      if (e.key == 'ArrowDown') dpad2[1] = 0;
    }, false);

    // let cy = 0;
    // window.addEventListener('touchstart', (e) => {
    //   // console.log(e.touches[0].clientX, e.touches[1]);
    //   cy = e.touches[0].clientY;
    // }, false);
    // window.addEventListener('touchend', (e) => {
    //   const { dpad1, dpad2 } = this;
    //   dpad2[1] = 0;
    // }, false);
    // // el.addEventListener('touchcancel', handleCancel, false);
    // window.addEventListener('touchmove', (e) => {
    //   const { dpad1, dpad2 } = this;
    //   const dy = cy - e.targetTouches[0].clientY;
    //   dpad2[1] = dy / 170 * -1;
    // }, false);

    scanGamepadsState();
  }

  static create() {
    const gamepad = new Gamepad();
    gamepad.init();
    return gamepad;
  }
}
