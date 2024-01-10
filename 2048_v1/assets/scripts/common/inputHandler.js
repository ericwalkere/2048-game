const Emitter = require("EventEmitter");
const code = require("eventCode");

cc.Class({
  extends: cc.Component,

  properties: {
    _isPress: false,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
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
    this.scheduleOnce(() => {
      this._isPress = false;
    }, 0.2);
  },
});
