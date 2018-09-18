/**
 * Stores current game state.
 * Can also save and load a game (TODO).
 */
export default class State {
  /**
   * Set grid dimensions.
   *
   * @param {number} cols
   * @param {number} rows
   */
  constructor (cols, rows) {
    this.cols = cols
    this.rows = rows
    this.tileStates = []
  }

  init () {
    // init states
    for (let s = 0; s < this.cols * this.rows; s++) {
      this.tileStates.push({})
    }
  }

  getTileState (col, row) {
    console.log(`getting state:`, col, row)
    return this.tileStates[row * this.cols + col]
  }

  setTileState (col, row, state) {
    this.tileStates[row * this.cols + col] = state
  }

  save () {}
  load () {}
}
