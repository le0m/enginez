/**
 * Handles movement with a touch device.
 *
 * TODO: smooth movement and handle excessive scrolling
 */
export default class Touch {
  /**
   * Set sensitivity.
   *
   * @param {number} sensitivity
   */
  constructor (sensitivity) {
    /* eslint-disable no-multi-spaces */
    this.sensitivity  = sensitivity
    this.isMoving     = false
    this.startX       = -1
    this.startY       = -1
    this.currX        = -1
    this.currY        = -1
    this.endX         = -1
    this.endY         = -1
  }

  /**
   * Attach event listeners for touch input.
   */
  listenForEvents () {
    window.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false })
    window.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false })
    window.addEventListener('touchend', this._onTouchEnd.bind(this))
    window.addEventListener('touchcancel', this._onTouchCancel.bind(this))
  }

  /**
   * Initializes `start` and `curr` properties.
   *
   * @param {TouchEvent} event
   * @private
   */
  _onTouchStart (event) {
    this.startX = this.currX = event.touches[0].pageX - event.touches[0].target.offsetLeft
    this.startY = this.currY = event.touches[0].pageY - event.touches[0].target.offsetTop
    this.isMoving = true
    event.preventDefault()
  }

  /**
   * Keep `curr` properties updated on position change.
   *
   * @param {TouchEvent} event
   * @private
   */
  _onTouchMove (event) {
    this.currX = event.touches[0].pageX - event.touches[0].target.offsetLeft
    this.currY = event.touches[0].pageY - event.touches[0].target.offsetTop
    this.isMoving = true

    event.preventDefault()
  }

  /**
   * Initializes `end` and updates `curr` properties.
   *
   * @param {TouchEvent} event
   * @private
   */
  _onTouchEnd (event) {
    this.endX = this.currX = event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft
    this.endY = this.currY = event.changedTouches[0].pageY - event.changedTouches[0].target.offsetTop
    this.isMoving = false
  }

  /**
   * Called in certain situations, like the finger went off the screen.
   * Same behavior as `Touch._onTouchEnd()`.
   *
   * @param {TouchEvent} event
   * @private
   */
  _onTouchCancel (event) {
    this.endX = this.currX = event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft
    this.endY = this.currY = event.changedTouches[0].pageY - event.changedTouches[0].target.offsetTop
    this.isMoving = false
  }

  /**
   * Get a vector of movement.
   *
   * - `x === -1`, left
   * - `x === +1`, right
   * - `x === -1`, up
   * - `x === +1`, down
   *
   * @returns {{x: number, y: number}}
   */
  getDirection () {
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
}
