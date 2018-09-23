import World from './World.js'
import Loader from './Loader.js'

/**
 * Engine core class, manages all components.
 *
 * To avoid movement and refresh rate problems, the `update()`
 * function is called in fixed steps of time instead that once
 * per frame, which also improves simulation consistency.
 * Time for the `update()` function is accumulated each tick
 * and used once it reaches a threshold. Accumulated time is
 * clamped to a max value, to prevent the "spiral of death".
 * See {@link Engine#constructor} to change these parameters.
 *
 * You need to extend this class and override loop methods.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Engine {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - Engine component configuration
   * @param {Number} [config.updateTimeStep=10] - Single step `update()` time (int, ms)
   * @param {Number} [config.updateTimeMax=50] - Max accumulated `update()` time (int, ms)
   * @param {Object} config.world - World component config (see {@link World#constructor})
   * @param {Object} config.loader - Loader component config (see {@link Loader#constructor})
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // time related
    this._delta             = 0
    this._previousTimestamp = 0
    this._updateTime        = 0
    this._updateTimeStep    = config.updateTimeStep || 10
    this._updateTimeMax     = config.updateTimeMax || 50

    // components related
    this.loader             = new Loader(config.loader)
    this.world              = new World(config.world)

    // other
    this.debug              = config.debug || false
  }

  /**
   * Start the game engine loop:
   * 1. load
   * 2. init
   * 3. start loop
   *
   * @returns {Promise}
   */
  run () {
    return Promise.all(this.load())
      .then((keys) => {
        this.init(keys)
        window.requestAnimationFrame(this.tick.bind(this))
      })
  }

  /**
   * Executes a tick of the game:
   * 1. clear frame
   * 2. compute delta
   * 3. update by fixed steps
   * 4. render
   *
   * @param {Number} timestamp
   */
  tick (timestamp) {
    // compute delta
    timestamp = timestamp | 0
    this._delta = timestamp - this._previousTimestamp // delta is in fraction of seconds
    this._previousTimestamp = timestamp
    this._updateTime += this._delta

    // avoid spiral of death
    if (this._updateTime > this._updateTimeMax) {
      if (this.debug) {
        console.warn(`[ENGINE] update time above threshold ${this._updateTime}, clamping to ${this._updateTimeMax}`)
      }

      this._updateTime = this._updateTimeMax
    }

    // stats
    this.fps = 1000 / this._delta | 0

    // update by fixed steps
    while (this._updateTime >= this._updateTimeStep) {
      this.update(this._updateTimeStep)
      this._updateTime -= this._updateTimeStep
    }

    this.render()
    window.requestAnimationFrame(this.tick.bind(this))
  }

  /**
   * Override to pre-load resources.
   *
   * Results will be passed down to {@link Engine#init}.
   *
   * @returns {Promise<String>|Promise<String>[]} - Promises resolving to the cache key
   */
  load () {}

  /**
   * Override to initialize other components.
   *
   * @param {Object} params - Results returned from {@link Engine#load}
   */
  init (params) {}

  /**
   * Override to handle state updates (ex. movement,
   * input, tile updates, ...).
   *
   * @param {Number} delta
   */
  update (delta) {}

  /**
   * Override to (re-)draw layers and canvas.
   */
  render () {}
}
