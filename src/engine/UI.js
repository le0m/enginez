/**
 * Handles UI display and interaction.
 */
export default class UI {
  /**
   * Some external functions are required to work:
   * - `getView`, from Camera object
   * - `addMessage`, from Queue object
   *
   * @param {number} tileSize
   * @param {Function} getView
   * @param {Function} addMessage
   */
  constructor (tileSize, getView, addMessage) {
    /* eslint-disable no-multi-spaces */
    this._getView     = getView
    this._addMessage  = addMessage
    this.tileSize     = tileSize
    this.canvas       = null
    this.div          = null
  }

  init () {
    this.canvas = document.getElementById('canvas')
    this.div = document.getElementById('ui')

    this.div.addEventListener('click', this._handleClick.bind(this))
  }

  _handleClick (event) {
    let pos = this._getPosition(event)
    let col = this._getView().startCol + ((pos.x - this._getView().offsetX) / this.tileSize | 0)
    let row = this._getView().startRow + ((pos.y - this._getView().offsetY) / this.tileSize | 0)

    console.log(`clicked:`, col, row)
    this._addMessage('click', {
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
