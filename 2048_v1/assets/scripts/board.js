// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const config = require("gConfig");

const Emitter = require("EventEmitter");
const code = require("eventCode");

cc.Class({
  extends: cc.Component,

  properties: {
    boardPos: cc.Node,
    spawnPoint: cc.Node,
    blockPrefab: cc.Prefab,
  },

  onLoad() {
    this.board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    Emitter.instance.registerEvent(code.INIT_BOARD, this.init.bind(this));
  },

  init() {
    this.board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    this.spawnPoint.removeAllChildren();
  },

  spawnBlock(r, c, value) {
    const block = cc.instantiate(this.blockPrefab);
    block.getComponent("block").setTile(this.getTileSkin(value));
    this.board[r][c] = block;
    block.parent = this.spawnPoint;
    block.position = this.getPos(r, c);
  },

  moveAction(r1, c1, r2, c2, cb) {
    Emitter.instance.emit(code.SET_LIMIT, false);
    cc.tween(this.board[r1][c1])
      .to(0.15, {
        position: this.getPos(r2, c2),
      })
      .call(cb && cb())
      .start();
    this.board[r2][c2] = this.board[r1][c1];
    this.board[r1][c1] = null;
  },

  mergeAction(r1, c1, r2, c2, value) {
    const node1 = this.board[r1][c1].getComponent("block");
    const node2 = this.board[r2][c2];

    node1.setTile(this.getTileSkin(value));
    node1.mergeAnim();
    node2.destroy();
  },

  getPos(r, c) {
    const pos = {
      x: this.boardPos.children[r].children[c].position.x,
      y: this.boardPos.children[r].position.y,
    };
    return cc.v2(pos.x, pos.y);
  },

  getTileSkin(key) {
    return config.TILE_SKIN[key];
  },
});
