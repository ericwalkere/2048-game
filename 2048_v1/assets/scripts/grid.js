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
    board: require("board"),
    _isLimit: false,
  },

  onLoad() {
    this.init();
    Emitter.instance.registerEvent(code.INIT_GRID, this.init.bind(this));
    Emitter.instance.registerEvent(code.SET_LIMIT, this.setLimit.bind(this));
  },

  init() {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    
    this._isLimit = false;
    this.createTile();

    this._isLimit = false;
    this.createTile();
  },

  slideLeft() {
    for (let r = 0; r < 4; r++) {
      const row = this.grid[r];
      this.changeDirection(row, r, "left");
    }
    this.createTile();
  },

  slideRight() {
    for (let r = 0; r < 4; r++) {
      const row = this.grid[r];
      this.changeDirection(row, r, "right");
    }
    this.createTile();
  },

  slideRight() {
    for (let r = 0; r < 4; r++) {
      const row = this.grid[r];
      this.changeDirection(row, r, "right");
    }
    this.createTile();
  },

  slideUp() {
    for (let c = 0; c < 4; c++) {
      let col = [
        this.grid[0][c],
        this.grid[1][c],
        this.grid[2][c],
        this.grid[3][c],
      ];
      this.changeDirection(col, c, "up");
    }
    this.createTile();
  },

  slideDown() {
    for (let c = 0; c < 4; c++) {
      let col = [
        this.grid[0][c],
        this.grid[1][c],
        this.grid[2][c],
        this.grid[3][c],
      ];
      this.changeDirection(col, c, "down");
    }
    this.createTile();
  },

  changeDirection(line, r, direction) {
    switch (direction) {
      case "left":
        this.slide(line, r, 1, 0);
        this.merge(line, r, 1, 0);
        break;
      case "right":
        this.slide(line, r, -1, 0);
        this.merge(line, r, -1, 0);
        break;
      case "up":
        this.slide(line, r, 1, 1);
        this.merge(line, r, 1, 1);
        break;
      case "down":
        this.slide(line, r, -1, 1);
        this.merge(line, r, -1, 1);
        break;
    }
  },

  slide(line, r, direction, rowOrCol) {
    let pivot = 0;
    let start = direction > 0 ? 0 : line.length - 1;
    let end = (i) => (direction > 0 ? i < line.length : i >= 0);
    for (let i = start; end(i); i += direction) {
      if (line[i] === 0) pivot++;
      else {
        const j = i - pivot * direction;
        [line[j], line[i]] = [line[i], line[j]];
        if (pivot !== 0) {
          if (rowOrCol === 0) {
            this.board.moveAction(r, i, r, j);
          } else {
            for (let c = 0; c < line.length; c++) {
              this.grid[c][r] = line[c];
            }
            this.board.moveAction(i, r, j, r);
          }
        }
      }
    }
  },

  merge(line, r, direction, rowOrCol) {
    let pivot = 0;
    let start = direction > 0 ? 0 : line.length - 1;
    let end = (i) => (direction > 0 ? i < line.length : i >= 0);
    for (let i = start; end(i); i += direction) {
      const next = i + 1 * direction;
      if (line[i] === line[next] && line[i] !== 0) {
        line[i] *= 2;
        line[next] = 0;
        Emitter.instance.emit(code.UPDATE_SCORE, line[i]);
        if (rowOrCol === 0) {
          this.board.moveAction(r, next, r, i, () => {
            this.board.mergeAction(r, next, r, i, line[i]);
          });
        } else {
          for (let c = 0; c < line.length; c++) {
            this.grid[c][r] = line[c];
          }
          this.board.moveAction(next, r, i, r, () => {
            this.board.mergeAction(next, r, i, r, line[i]);
          });
        }
      }
      if (line[i] === 0) pivot++;
      else {
        const j = i - pivot * direction;
        [line[j], line[i]] = [line[i], line[j]];
        if (pivot !== 0) {
          if (rowOrCol === 0) {
            this.board.moveAction(r, i, r, j);
          } else {
            for (let c = 0; c < line.length; c++) {
              this.grid[c][r] = line[c];
            }
            this.board.moveAction(i, r, j, r);
          }
        }
      }
    }
  },

  createTile() {
    if (this.checkWin()) return;
    if (!this.checkEmpty() && !this.checkGameOver()) return;
    if (!this.checkEmpty()) return;
    if (this._isLimit) return;

    let found = false;
    while (!found) {
      let r = Math.floor(Math.random() * 4);
      let c = Math.floor(Math.random() * 4);
      let randomValue = Math.random() > 0.8 ? 4 : 2;
      if (this.grid[r][c] == 0) {
        this.grid[r][c] = randomValue;
        this.board.spawnBlock(r, c, randomValue);
        found = true;
      }
    }
    this._isLimit = true;
  },

  checkEmpty() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) return true;
      }
    }
    return false;
  },

  checkGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (
          (r > 0 && this.grid[r][c] === this.grid[r - 1][c]) ||
          (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) ||
          (c > 0 && this.grid[r][c] === this.grid[r][c - 1]) ||
          (c < 3 && this.grid[r][c] === this.grid[r][c + 1])
        ) {
          return true;
        }
      }
    }
    Emitter.instance.emit(code.LOSE);
    return false;
  },

  checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 2048) {
          Emitter.instance.emit(code.WIN);
          return true;
        }
      }
    }
    return false;
  },

  setLimit(isLimit) {
    this._isLimit = isLimit;
  },
});
