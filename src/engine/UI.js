'use strict'

//
// UI handler
//

const UI = {
  view: null, // reference to Camera.view
  canvas: null,
  div: null
}

UI.EVENT_TILE_CLICKED = 0

UI.init = function (view) {
  this.view = view
  this.canvas = document.getElementById('canvas')
  this.div = document.getElementById('ui')

  this.div.addEventListener('click', this._handleClick.bind(this))
}

UI._handleClick = function (event) {
  let pos = this._getPosition(event)
  let col = this.view.startCol + ((pos.x - this.view.offsetX) / assets.tileSize | 0)
  let row = this.view.startRow + ((pos.y - this.view.offsetY) / assets.tileSize | 0)

  console.log(`clicked:`, col, row)
  Queue.add('click', {
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
