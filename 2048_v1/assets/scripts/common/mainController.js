const Emitter = require("EventEmitter");
const code = require("eventCode");
const MainFSM = require("MainFSM");

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
  },

  onLoad() {
    Emitter.instance = new Emitter();
    MainFSM.instance = new MainFSM();
    MainFSM.instance.initStateMachine();

    this.registerEventListeners();
    this.loadData();
  },

  registerEventListeners() {
    Emitter.instance.registerEvent(code.INPUT_A, this.slide.bind(this, "left"));
    Emitter.instance.registerEvent(
      code.INPUT_D,
      this.slide.bind(this, "right")
    );
    Emitter.instance.registerEvent(code.INPUT_W, this.slide.bind(this, "up"));
    Emitter.instance.registerEvent(code.INPUT_S, this.slide.bind(this, "down"));

    Emitter.instance.registerOnce(code.WIN, this.onWin.bind(this));
    Emitter.instance.registerOnce(code.LOSE, this.onLose.bind(this));

    Emitter.instance.registerEvent(
      code.UPDATE_SCORE,
      this.updateScore.bind(this)
    );
  },

  startGame() {
    MainFSM.instance._fsm.goInput();
    this.startPanel.active = false;
  },

  newGame() {
    MainFSM.instance._fsm.goNew();
    MainFSM.instance._fsm.goStart();
    this.newGamePoll.active = true;
  },

  yesNewGame() {
    MainFSM.instance._fsm.goInput();
    this.newGamePoll.active = false;
    this._scoreValue = 0;
    this.scoreText.string = 0;

    Emitter.instance.emit(code.INIT_BOARD);
    Emitter.instance.emit(code.INIT_GRID);
    this.winPanel.active = false;
    this.losePanel.active = false;
  },

  noNewGame() {
    MainFSM.instance._fsm.goInput();
    this.newGamePoll.active = false;
    this.winPanel.active = false;
    this.losePanel.active = false;
  },

  slide(direction) {
    if (MainFSM.instance.isStateWin() || MainFSM.instance.isStateLose()) return;

    MainFSM.instance._fsm.goMoving();

    switch (direction) {
      case "left":
        this.grid.slideLeft();
        break;
      case "right":
        this.grid.slideRight();
        break;
      case "up":
        this.grid.slideUp();
        break;
      case "down":
        this.grid.slideDown();
        break;
      default:
        break;
    }

    if (MainFSM.instance.isStateWin() || MainFSM.instance.isStateLose()) return;
    MainFSM.instance._fsm.goInput();
  },

  onWin() {
    MainFSM.instance._fsm.goWin();
    this.winPanel.active = true;
  },

  onLose() {
    MainFSM.instance._fsm.goLose();
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

    if (savedPlayerInfo !== null) {
      const playerInfo = JSON.parse(savedPlayerInfo);
      this._bestValue = playerInfo.score;
      this.bestText.string = this._bestValue;
    }
  },
});
