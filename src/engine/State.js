/**
 * This component stores the current game state.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class State {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - State component config
   * @param {Number} config.layers - Map layers (int)
   * @param {Number} config.rows - Map rows (int)
   * @param {Number} config.cols - Map columns (int)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // dimensions related
    this.layers = config.layers
    this.rows   = config.rows
    this.cols   = config.cols

    // other
    this.tileStates = []
    this.debug  = config.debug || false

    this._initStates()
  }

  /**
   * Initializes the map with empty states.
   *
   * @private
   */
  _initStates () {
    let r = 0, c = 0

    for (let l = 0; l < this.layers; l++) {
      this.tileStates[l] = []

      for (r = 0; r < this.rows; r++) {
        this.tileStates[l][r] = []

        for (c = 0; c < this.cols; c++) {
          this.tileStates[l][r].push({})
        }
      }
    }
  }

  /**
   * Get the current state of a tile.
   *
   * @param {Number} layer - 0-indexed tile layer (int)
   * @param {Number} row - 0-indexed tile row (int)
   * @param {Number} col - 0-indexed tile column (int)
   * @returns {Object} - Tile state
   */
  getTileState (layer, row, col) {
    return this.tileStates[layer][row][col]
  }

  /**
   * Set the current (updated) state of a tile.
   *
   * @param {Object} state - New tile state
   * @param {Number} layer - 0-indexed tile layer (int)
   * @param {Number} row - 0-indexed tile row (int)
   * @param {Number} col - 0-indexed tile column (int)
   */
  setTileState (state, layer, row, col) {
    this.tileStates[layer][row][col] = state
  }

  /**
   * Save current state to `localStorage`.
   */
  save () {}

  /**
   * Load current state from `localStorage`.
   */
  load () {}
}
