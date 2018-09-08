'use strict'

//
// UI handler
//

const UI = {
  view: null,
  canvas: null,
  div: null
}

UI.init = function (view) {
  this.canvas = document.getElementById('canvas')
  this.div = document.getElementById('ui')
  this.view = view // reference to Camera.view

  this.div.addEventListener('click', this._handleClick.bind(this))
}

UI._handleClick = function (event) {
  let pos = this._getPosition(event)
  let startCol = this.view.startCol
  let startRow = this.view.startRow
  let tileSize = assets.tileSize

  /**
   * - ( pos.x / tileSize | 0)
   */
}

/**
 * Normalized position, for mouse and touch.
 *
 * @private
 */
UI._getPosition = function (event) {
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
