/**
 * This component stores the current game state.
 *
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
    this.layers   = config.layers
    this.rows     = config.rows
    this.cols     = config.cols

    // other
    this.stateMap = []
    this.debug    = config.debug || false

    this._initStates()

    if (this.debug) {
      console.log(`[STATE] created map (${this.layers} x ${this.cols} x ${this.rows} cells)`)
    }
  }

  /**
   * Initializes the map with default states.
   * Each state knows his layer, column and row.
   *
   * @private
   */
  _initStates () {
    let r = 0, c = 0

    for (let l = 0; l < this.layers; l++) {
      this.stateMap[l] = []

      for (r = 0; r < this.rows; r++) {
        this.stateMap[l][r] = []

        for (c = 0; c < this.cols; c++) {
          this.stateMap[l][r].push({
            layer: l,
            col: c,
            row: r
          })
        }
      }
    }
  }

  /**
   * Get the current state of a tile.
   *
   * @param {Number} layer - 0-indexed tile layer (int)
   * @param {Number} col - 0-indexed tile column (int)
   * @param {Number} row - 0-indexed tile row (int)
   * @returns {TileState|BuildingState} - Tile state
   */
  getTileState (layer, col, row) {
    return this.stateMap[layer][row][col]
  }

  /**
   * Set the current (updated) state of a tile.
   *
   * @param {TileState|BuildingState} state - New tile state
   * @param {Number} layer - 0-indexed tile layer (int)
   * @param {Number} col - 0-indexed tile column (int)
   * @param {Number} row - 0-indexed tile row (int)
   */
  setTileState (state, layer, col, row) {
    this.stateMap[layer][row][col] = state
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
