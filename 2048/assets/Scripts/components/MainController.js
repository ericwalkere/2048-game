const Emitter = require("EventEmitter");

cc.Class({
  extends: cc.Component,

  properties: {
    _touchStartX: 0,
    _touchStartY: 0,
    isPress: false,
  },

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
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
      Emitter.instance.emit("slideR");
    } else if (deltaX < -10 && !this.isPress) {
      this.isPress = true;
      Emitter.instance.emit("slideL");
    } else if (deltaY > 10 && !this.isPress) {
      this.isPress = true;
      Emitter.instance.emit("slideU");
    } else if (deltaY < -10 && !this.isPress) {
      this.isPress = true;
      Emitter.instance.emit("slideD");
    }

    this._touchStartX = currentX;
    this._touchStartY = currentY;
  },
});
