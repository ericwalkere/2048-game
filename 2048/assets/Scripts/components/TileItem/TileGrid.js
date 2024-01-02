// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const config = require("GameConfig");
const mathf = require("utilities");
const Emitter = require("EventEmitter");

cc.Class({
  extends: cc.Component,

  properties: {
    boardMap: require("Board"),
    tileItemPrefab: cc.Prefab,
  },

  onLoad() {
    Emitter.instance.registerEvent("slideL", this.slideLeft.bind(this));
    Emitter.instance.registerEvent("slideR", this.slideRight.bind(this));
    Emitter.instance.registerEvent("slideU", this.slideUp.bind(this));
    Emitter.instance.registerEvent("slideD", this.slideDown.bind(this));

    this.init();
  },
  init() {
    this.newPos = {};
    this.board = config.TILE;
    this.rows = config.BOARD.ROWS;
    this.cols = config.BOARD.COLS;

    this.createTileItem();
    this.createTileItem();
    this.displayBoard();
  },

  slide(row) {
    row = mathf.filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] == row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }
    row = mathf.filterZero(row);
    while (row.length < this.cols) {
      row.push(0);
    }
    return row;
  },

  slideLeft() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row = this.slide(row);

      this.board[r] = row;
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c] !== 0) {
        }
      }
    }
    this.createTileItem();
    this.displayBoard();
  },

  slideRight() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row.reverse();
      row = this.slide(row);
      this.board[r] = row.reverse();
      for (let c = 0; c < this.cols; c++) {}
    }
    this.createTileItem();
    this.displayBoard();
  },

  slideUp() {
    for (let c = 0; c < this.cols; c++) {
      let row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
        this.board[4][c],
      ];
      row = this.slide(row);
      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = row[r];
      }
    }
    this.createTileItem();
    this.displayBoard();
  },

  slideDown() {
    for (let c = 0; c < this.cols; c++) {
      let row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
        this.board[4][c],
      ];
      row.reverse();
      row = this.slide(row);
      row.reverse();
      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = row[r];
      }
    }
    this.createTileItem();
    this.displayBoard();
  },

  spawnTileItem(data) {
    const newItem = cc.instantiate(this.tileItemPrefab);
    this.updatePos(newItem);
    newItem.getComponent("TileItem").setTile(data);
    newItem.parent = this.node;
  },

  updatePos(cell) {
    cell.x = this.newPos.posX;
    cell.y = this.newPos.posY;
  },

  createTileItem() {
    if (!this.hasEmptyTile()) {
      return;
    }
    if (this.hasAvailableMoves()) {
      return;
    }
    let found = false;
    while (!found) {
      let r = mathf.random(this.rows);
      let c = mathf.random(this.cols);
      const randomNumber = Math.random() < 0.75 ? 2 : 4;
      if (this.board[r][c] == 0) {
        this.board[r][c] = randomNumber;
        found = true;
      }
    }
  },

  displayBoard() {
    if (!this.hasEmptyTile()) {
      if (!this.hasAvailableMoves()) {
        Emitter.instance.emit("LoseGame");
        return;
      }
      return;
    }
    this.node.removeAllChildren();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c] !== 0) {
          let num = this.board[r][c];
          this.newPos = this.boardMap.getTilePos(r, c);
          this.spawnTileItem(config.TILE_SKIN[num]);
          if (num === 2048) {
            Emitter.instance.emit("WinGame");
          }
        }
      }
    }
  },

  hasEmptyTile() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c] == 0) {
          return true;
        }
      }
    }
    return false;
  },

  hasAvailableMoves() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c] !== 0) {
          if (c - 1 >= 0 && this.board[r][c - 1] === this.board[r][c]) {
            return true;
          }
          if (c + 1 < this.cols && this.board[r][c + 1] === this.board[r][c]) {
            return true;
          }
          if (r - 1 >= 0 && this.board[r - 1][c] === this.board[r][c]) {
            return true;
          }
          if (r + 1 < this.rows && this.board[r + 1][c] === this.board[r][c]) {
            return true;
          }
        }
      }
    }
  },
});
