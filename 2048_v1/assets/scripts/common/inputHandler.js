const Emitter = require("EventEmitter");
const code = require("eventCode");

cc.Class({
  extends: cc.Component,

  properties: {
    _isPress: false,
    _touchStartX: 0,
    _touchStartY: 0,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
  },

  onKeyDown(event) {
    if (this._isPress) return;
    this._isPress = true;
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        Emitter.instance.emit(code.INPUT_A);
        break;
      case cc.macro.KEY.d:
        Emitter.instance.emit(code.INPUT_D);

        break;
      case cc.macro.KEY.w:
        Emitter.instance.emit(code.INPUT_W);

        break;
      case cc.macro.KEY.s:
        Emitter.instance.emit(code.INPUT_S);
        break;
    }
  },

  onKeyUp() {
    this._isPress = false;
  },

  onTouchStart(event) {
    this._touchStartX = event.getLocationX();
    this._touchStartY = event.getLocationY();
    this.isPress = false;
  },

  onTouchMove(event) {
    let currentX = event.getLocationX();
    let currentY = event.getLocationY();
    let deltaX = currentX - this._touchStartX;
    let deltaY = currentY - this._touchStartY;

    if (deltaX > 10 && !this.isPress) {
      this.isPress = true;
      Emitter.instance.emit(code.INPUT_D);
    } else if (deltaX < -10 && !this.isPress) {
      this.isPress = true;
      Emitter.instance.emit(code.INPUT_A);
    } else if (deltaY > 10 && !this.isPress) {
      this.isPress = true;
      Emitter.instance.emit(code.INPUT_W);
    } else if (deltaY < -10 && !this.isPress) {
      this.isPress = true;
      Emitter.instance.emit(code.INPUT_S);
    }

    this._touchStartX = currentX;
    this._touchStartY = currentY;
  },
});
