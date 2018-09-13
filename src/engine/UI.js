/**
 * Handles UI display and interaction.
 */
export default class UI {
  /**
   * - `view`, property from Camera object
   * - `queue`, Queue object
   *
   * @param {number} tileSize
   * @param {Object} view
   * @param {Queue} queue
   */
  constructor (tileSize, view, queue) {
    /* eslint-disable no-multi-spaces */
    this._view    = view
    this._queue   = queue
    this.tileSize = tileSize
    this.canvas   = null
    this.div      = null
  }

  init () {
    this.canvas = document.getElementById('canvas')
    this.div = document.getElementById('ui')

    this.div.addEventListener('click', this._handleClick.bind(this))
  }

  _handleClick (event) {
    let pos = this._getPosition(event)
    let col = this._view.startCol + ((pos.x - this._view.offsetX) / this.tileSize | 0)
    let row = this._view.startRow + ((pos.y - this._view.offsetY) / this.tileSize | 0)

    console.log(`clicked:`, col, row)
    this._queue.add('click', {
      col: col,
      row: row
    })
  }

  /**
   * Normalized position, for mouse and touch.
   *
   * @param {MouseEvent|TouchEvent} event
   * @return {{ x: number, y: number}}
   * @private
   */
  _getPosition (event) {
    let rect = this.canvas.getBoundingClientRect()
    let pos = { x: 0, y: 0 }

    if (event.touches && event.touches.length > 0) {
      pos.x = event.touches[0].pageX - rect.left
      pos.y = event.touches[0].pageY - rect.top
    } else {
      pos.x = event.pageX - rect.left
      pos.y = event.pageY - rect.top
    }

    return pos
  }
}
