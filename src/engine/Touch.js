import BaseInput from './BaseInput.js'
import { ConsoleExtra } from '../utils.js'

const console = ConsoleExtra(window.console)

/**
 * This component implements {@link BaseInput} for touch devices.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Touch extends BaseInput {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - Keyboard component config
   * @param {Number} config.sensitivity - Touch movement sensitivity
   */
  constructor (config) {
    super(config)

    this.sensitivity  = config.sensitivity
    this.startX       = -1
    this.startY       = -1
    this.currX        = -1
    this.currY        = -1
    this.endX         = -1
    this.endY         = -1

    this._initListeners()

    if (this.debug) {
      console.log(`[TOUCH] listeners attached (touchstart, touchmove, touchend and touchcancel)`)
    }
  }

  /**
   * Initialize event listeners.
   *
   * @private
   */
  _initListeners () {
    // Chrome and Firefox set `passive` to `true` on some elements
    // see: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
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
    console.throttle(1000).log(`[DEBUG] touch start`)
    this.startX = this.currX = event.touches[0].pageX - event.touches[0].target.offsetLeft
    this.startY = this.currY = event.touches[0].pageY - event.touches[0].target.offsetTop
  }

  /**
   * Keep `curr` properties updated on position change.
   *
   * @param {TouchEvent} event
   * @private
   */
  _onTouchMove (event) {
    console.throttle(1000).log(`[DEBUG] touch move`)
    this.currX = event.touches[0].pageX - event.touches[0].target.offsetLeft
    this.currY = event.touches[0].pageY - event.touches[0].target.offsetTop
  }

  /**
   * Initializes `end` and updates `curr` properties.
   *
   * @param {TouchEvent} event
   * @private
   */
  _onTouchEnd (event) {
    console.throttle(1000).log(`[DEBUG] touch end`)
    this.endX = this.currX = event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft
    this.endY = this.currY = event.changedTouches[0].pageY - event.changedTouches[0].target.offsetTop

    // set start to stop movement
    this.startX = this.endX
    this.startY = this.endY
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

    // set start to stop movement
    this.startX = this.endX
    this.startY = this.endY
  }

  /**
   * @inheritDoc
   */
  getDirection () {
    let x = 0, y = 0

    // sensitivity of coordinates change
    const deltaX = this.currX - this.startX
    const deltaY = this.currY - this.startY

    if (Math.abs(deltaX) > this.sensitivity) {
      if (deltaX > 0) { x = -1 } // left
      if (deltaX < 0) { x = 1 }  // right
    }

    if (Math.abs(deltaY) > this.sensitivity) {
      if (deltaY > 0) { y = -1 } // up
      if (deltaY < 0) { y = 1 }  // down
    }

    return [x, y]
  }

  /**
   * @inheritDoc
   */
  getDistance (delta) {
    let [x, y] = this.getDirection()
    console.throttle(1000).log(`[DEBUG] direction: ${x} | ${y}`)

    if (x !== 0) {
      x = this.startX - this.currX
      this.startX = this.currX
    }

    if (y !== 0) {
      y = this.startY - this.currY
      this.startY = this.currY
    }

    console.throttle(1000).log(`[DEBUG] touch distance: ${x} | ${y}`)

    return [x, y]
  }
}
