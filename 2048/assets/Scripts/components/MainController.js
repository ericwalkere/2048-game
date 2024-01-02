const Emitter = require("EventEmitter");

cc.Class({
  extends: cc.Component,

  properties: {
    _touchStartX: 0,
    _touchStartY: 0,
    _isPress: false,
    winPanel: cc.Node,
    _isWinGame: false,
    LosePanel: cc.Node,
    _isLoseGame: false,
    tutorialPanel:cc.Node,
    _isLock:false,
  },

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    Emitter.instance.registerOnce("WinGame", this.isWin.bind(this));
    Emitter.instance.registerOnce("LoseGame", this.isLose.bind(this));
  },

  onKeyDown: function (event) {
    if (this._isLock) {
      return;
    }
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        Emitter.instance.emit("slideL");
        break;
      case cc.macro.KEY.d:
        Emitter.instance.emit("slideR");
        break;
      case cc.macro.KEY.w:
        Emitter.instance.emit("slideU");
        break;
      case cc.macro.KEY.s:
        Emitter.instance.emit("slideD");
        break;
    }
  },

  onTouchStart(event) {
    this._touchStartX = event.getLocationX();
    this._touchStartY = event.getLocationY();
    this._isPress = false;
  },

  onTouchMove(event) {
    if (this._isLock) {
      return;
    }
    
    let currentX = event.getLocationX();
    let currentY = event.getLocationY();
    let deltaX = currentX - this._touchStartX;
    let deltaY = currentY - this._touchStartY;

    if (deltaX > 10 && !this._isPress) {
      this._isPress = true;
      Emitter.instance.emit("slideR");
    } else if (deltaX < -10 && !this._isPress) {
      this._isPress = true;
      Emitter.instance.emit("slideL");
    } else if (deltaY > 10 && !this._isPress) {
      this._isPress = true;
      Emitter.instance.emit("slideU");
    } else if (deltaY < -10 && !this._isPress) {
      this._isPress = true;
      Emitter.instance.emit("slideD");
    }

    this._touchStartX = currentX;
    this._touchStartY = currentY;
  },

  isWin() {
    this.winPanel.active = true;
    this._isLock = true;
  },

  isLose() {
    this.LosePanel.active = true;
    this._isLock = true;
  },

  openTutorial(){
    this.tutorialPanel.active = true;
    this._isLock = true;
  },

  closeTutorial(){
    this.tutorialPanel.active = false;
    this._isLock = false;
  }
});
