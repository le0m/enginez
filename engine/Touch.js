'use strict'

//
// Touch handler
//
// TODO: smooth movement and handle excessive scrolling
//

const Touch = {
  isMoving: false,
  startX: -1,
  startY: -1,
  currX: -1,
  currY: -1,
  endX: -1,
  endY: -1,
  sensitivity: 0
}

/**
 * Attach event listeners for touch input.
 *
 * There is a subtle difference in coordinates parameters:
 * - `pageX` coordinates relative to the edge of the document, including horizontal scroll offset
 * - `clientX` coordinates relative to the edge of the browser viewport, excluding any scroll offset
 */
Touch.listenForEvents = function (sensibility) {
  this.sensitivity = sensibility

  window.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false })
  window.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false })
  window.addEventListener('touchend', this._onTouchEnd.bind(this))
  window.addEventListener('touchcancel', this._onTouchCancel.bind(this))
}

Touch._onTouchStart = function (event) {
  this.startX = this.currX = event.touches[0].pageX - event.touches[0].target.offsetLeft
  this.startY = this.currY = event.touches[0].pageY - event.touches[0].target.offsetTop
  this.isMoving = true
  event.preventDefault()
}

Touch._onTouchMove = function (event) {
  this.currX = event.touches[0].pageX - event.touches[0].target.offsetLeft
  this.currY = event.touches[0].pageY - event.touches[0].target.offsetTop
  this.isMoving = true

  event.preventDefault()
}

Touch._onTouchEnd = function (event) {
  this.endX = this.currX = event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft
  this.endY = this.currY = event.changedTouches[0].pageY - event.changedTouches[0].target.offsetTop
  this.isMoving = false
}

Touch._onTouchCancel = function (event) {
  this.endX = this.currX = event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft
  this.endY = this.currY = event.changedTouches[0].pageY - event.changedTouches[0].target.offsetTop
  this.isMoving = false
}

Touch.getDirection = function () {
  let dir = { x: 0, y: 0 }

  // sensitivity of coordinates change
  let deltaX = this.currX - this.startX
  let deltaY = this.currY - this.startY

  if (Math.abs(deltaX) > this.sensitivity) {
    if (deltaX > 0) { dir.x = -1 } // left
    if (deltaX < 0) { dir.x = 1 }  // right
  }

  if (Math.abs(deltaY) > this.sensitivity) {
    if (deltaY > 0) { dir.y = -1 } // up
    if (deltaY < 0) { dir.y = 1 }  // down
  }

  return dir
}
