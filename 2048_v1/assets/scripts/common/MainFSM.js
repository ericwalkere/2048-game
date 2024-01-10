// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const StateMachine = require("javascript-state-machine");
const Emitter = require("EventEmitter");
const code = require("eventCode");

const TRANSITION = {
  GO_START: "goStart",
  GO_INPUT: "goInput",
  GO_MOVING_BLOCK: "goMoving",
  GO_NEW:'goNew',
  GO_WIN: "goWin",
  GO_LOSE: "goLose",
};

const STATE = {
  START: "start",
  INPUT: "waitingInput",
  MOVING: "movingBLock",
  NEW:'newGame',
  WIN: "win",
  LOSE: "lose",
};

const MainFSM = cc.Class({
  extends: cc.Component,

  properties: {
    _fsm: null,
  },

  initStateMachine() {
    this._fsm = new StateMachine({
      init: STATE.START,
      transitions: [
        { name: TRANSITION.GO_START, from: STATE.NEW, to: STATE.START },
        { name: TRANSITION.GO_INPUT, from: STATE.START, to: STATE.INPUT },
        { name: TRANSITION.GO_INPUT, from: STATE.MOVING, to: STATE.INPUT },

        {name: TRANSITION.GO_MOVING_BLOCK,from: STATE.INPUT,to: STATE.MOVING,},

        { name: TRANSITION.GO_WIN, from: "*", to: STATE.WIN },

        { name: TRANSITION.GO_LOSE, from: "*", to: STATE.LOSE },

        { name: TRANSITION.GO_NEW, from: "*", to: STATE.NEW },
      ],
      methods: {
        onInvalidTransition(...args) {
            console.trace('invalid', ...args)
        }
        // onInput: this.onInput.bind(this),
        // onMoving: this.onMoving.bind(this),
        // onWin: this.onWin.bind(this),
        // onLose: this.onLose.bind(this),
      },
    });
  },

  onInput() {
    cc.log("onInput");
  },

  onMoving() {
    cc.log("onMoving");
  },

  onWin() {
    cc.log("onWin");
  },

  onLose() {
    cc.log("onLose");
  },

  isStateInput() {
    return this._fsm.state === STATE.INPUT;
  },
  isStateMoving() {
    return this._fsm.state === STATE.MOVING;
  },
  isStateWin() {
    return this._fsm.state === STATE.WIN;
  },
  isStateLose() {
    return this._fsm.state === STATE.LOSE;
  },
});

MainFSM.instance = null;
module.exports = MainFSM;
