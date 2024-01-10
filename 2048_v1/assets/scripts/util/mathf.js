module.exports = {
  random(value) {
    return Math.floor(Math.random() * value);
  },
  checkEmpty(grid) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) {
          return true;
        }
      }
    }
    return false;
  },
};

// updateGrid(row, r) {
//   let zeroIdx = row.indexOf(null);
//   let numIdx = row.findIndex((value) => value !== null);
//   for (let i = zeroIdx + 1; i < 4; i++) {
//     if (row[i] !== null) {
//       if (i !== numIdx && this.merge(row[i], row[numIdx])) {
//         // merge
//         // (r, i) -> (r, numIdx)\
//         this.moveAction(this.board[r][i], this.map[r][numIdx]);
//         row[numIdx] *= 2;
//         row[i] = null;
//         // todo: move -> merge
//         zeroIdx = ++numIdx;
//       } else if (zeroIdx !== -1) {
//         // move
//         // (r, i) -> (r, zeroIdx)
//         this.moveAction(this.board[r][i], this.map[r][zeroIdx]);
//         row[zeroIdx] = row[i];
//         row[i] = null;
//         // todo: move
//         numIdx = zeroIdx;
//         zeroIdx++;
//       }
//     }
//   }
// },
