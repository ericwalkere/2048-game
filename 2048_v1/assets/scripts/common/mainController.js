// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const Emitter = require("EventEmitter");
const code = require("eventCode");
cc.Class({
  extends: cc.Component,

  properties: {
    grid: require("grid"),
    winPanel: cc.Node,
    losePanel: cc.Node,
    newGamePoll: cc.Node,
    startPanel: cc.Node,
    scoreText: cc.Label,
    bestText: cc.Label,
    _scoreValue: 0,
    _bestValue: 0,
    _isLock: false,
  },

  onLoad() {
    Emitter.instance = new Emitter();

    Emitter.instance.registerEvent(code.INPUT_A, this.slideA.bind(this));
    Emitter.instance.registerEvent(code.INPUT_D, this.slideD.bind(this));
    Emitter.instance.registerEvent(code.INPUT_W, this.slideW.bind(this));
    Emitter.instance.registerEvent(code.INPUT_S, this.slideS.bind(this));

    Emitter.instance.registerOnce(code.WIN, this.onWin.bind(this));
    Emitter.instance.registerOnce(code.LOSE, this.onLose.bind(this));

    Emitter.instance.registerEvent(
      code.UPDATE_SCORE,
      this.updateScore.bind(this)
    );
    this.loadData();
  },

  newGame() {
    this._isLock = true;
    this.newGamePoll.active = true;
  },

  startGame() {
    this.startPanel.active = false;
    this.yesNEW();
  },

  yesNEW() {
    this._isLock = false;
    this.newGamePoll.active = false;
    this._scoreValue = 0;
    this.scoreText.string = 0;

    Emitter.instance.emit(code.INIT_BOARD);
    Emitter.instance.emit(code.INIT_GRID);
    this.winPanel.active = false;
    this.losePanel.active = false;
  },

  noNEW() {
    this._isLock = false;
    this.newGamePoll.active = false;
    this.winPanel.active = false;
    this.losePanel.active = false;
  },

  slideA() {
    if (this._isLock) return;
    this.grid.slideLeft();
  },
  slideD() {
    if (this._isLock) return;

    this.grid.slideRight();
  },
  slideW() {
    if (this._isLock) return;
    this.grid.slideUp();
  },
  slideS() {
    if (this._isLock) return;
    this.grid.slideDown();
  },

  onWin() {
    this._isLock = true;
    this.winPanel.active = true;
  },

  onLose() {
    this._isLock = true;
    this.losePanel.active = true;
  },

  updateScore(value) {
    this._scoreValue += value;
    this.scoreText.string = this._scoreValue;
    if (this._scoreValue >= this._bestValue) {
      this._bestValue = this._scoreValue;
      this.bestText.string = this._bestValue;
      this.saveData();
    }
  },

  saveData() {
    const data = {
      name: "a",
      score: this._bestValue,
    };
    cc.sys.localStorage.setItem("playerInfo", JSON.stringify(data));
  },

  loadData() {
    const savedPlayerInfo = cc.sys.localStorage.getItem("playerInfo");
    cc.log("====  loadData  ======");

    if (savedPlayerInfo !== null) {
      const playerInfo = JSON.parse(savedPlayerInfo);
      cc.log("data", playerInfo);
      this._bestValue = playerInfo.score;
      this.bestText.string = this._bestValue;
    }
  },
});
