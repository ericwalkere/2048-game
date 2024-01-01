module.exports = {
  random(value) {
    return Math.floor(Math.random() * value);
  },
  filterZero(row) {
    return row.filter((num) => num != 0);
  },
};
