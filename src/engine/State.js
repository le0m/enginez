'use strict'

const State = {
  cols: 0,
  rows: 0,
  tileStates: []
}

State.init = function (cols, rows) {
  this.cols = cols
  this.rows = rows

  // init states
  for (let s = 0; s < cols * rows; s++) {
    this.tileStates.push({})
  }
}

State.getTileState = function (col, row) {
  console.log(`getting state:`, col, row)
  return this.tileStates[row * this.cols + col]
}

State.setTileState = function (col, row, state) {
  this.tileStates[row * this.cols + col] = state
}

State.save = function () {}
State.load = function () {}
