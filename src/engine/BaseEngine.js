import Loader from './Loader.js'
import World from './World'

/**
 * Engine core class, manages all components.
 *
 * To avoid movement and refresh rate problems, the `update()`
 * function is called in fixed steps of time instead that once
 * per frame, which also improves simulation consistency.
 * Time for the `update()` function is accumulated each tick
 * and used once it reaches a threshold. Accumulated time is
 * clamped to a max value, to prevent the "spiral of death".
 * See {@link BaseEngine#constructor} to change these parameters.
 *
 * You need to extend this class and override loop methods.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseEngine {
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
    this.world              = new World({
      ...config.world,
      loader: this.loader
    })

    // other
    this.fps                = 0
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
      .then((results) => {
        this.init(results)
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
   * Pre-load resources.
   * Override to pre-load resources outside
   * of configuration.
   *
   * @returns {Promise<String>[]} - Cache keys of the loaded images, passed down to {@link BaseEngine#init}
   */
  load () {
    return this.world.load()
  }

  /**
   * Initialize Engine and components.
   * Override to initialize custom components.
   *
   * @param {Object} params - Results returned from {@link BaseEngine#load}
   */
  init (params) {
    this.world.init()
  }

  /**
   * Update game status.
   * Override to apply custom update logic.
   *
   * @param {Number} delta
   */
  update (delta) {
    this.world.update(delta)
  }

  /**
   * Render current world position.
   * Override to draw custom entities.
   */
  render () {
    this.world.draw()
  }
}
