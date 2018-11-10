import Observable from '../../engine/Observable'

/**
 * Base Building logic.
 *
 * TODO: use e decay system for long-paused buildings
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseBuilding extends Observable {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - BaseBuilding component configuration
   * @param {String} config.name - Building name
   * @param {Number} config.tileID - ID of the tile representing this build
   * @param {Object} config.cost - Resources cost to build ({food: Number, wood: Number, rock: Number})
   * @param {Object} config.production - Building production ({food: Number, wood: Number, rock: Number})
   * @param {Number} config.time - Production time (int, s)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super(config)

    this.name               = config.name
    this.tileID             = config.tileID
    this.cost               = config.cost
    this.production         = config.production
    this.time               = config.time * 1000
    this.begin              = Date.now()
    this.end                = this.begin + this.time
    this._previousTimestamp = 0
    this.paused             = false // this.begin
    this.workers            = 0
    this.position           = null // building position on the map (col, row)

    // other
    this.debug = config.debug || false
  }

  /**
   * Reset current production progress.
   *
   * @param {Boolean} [pause=false] - Whether to pause or not the production after reset
   */
  reset (pause = false) {
    this.begin = Date.now()
    this.end = this.begin + this.time
    this.paused = pause ? this.begin : false
  }

  /**
   * Pause current production progress.
   */
  pause () {
    if (!this.paused) {
      this.paused = Date.now()
    }
  }

  /**
   * Resume production progress.
   */
  resume () {
    if (this.paused) {
      this.end += Date.now() - this.paused
      this.paused = false
    }
  }

  /**
   * Check if production is ready and produce.
   *
   * @param {Number} timestamp - Time since start (int, ms)
   * @returns {{food: Number, wood: Number, rock: Number}|Boolean} - Resource production, or `false` if not ready
   */
  produce (timestamp) {
    if (this._previousTimestamp === 0) {
      this._previousTimestamp = timestamp
    }

    if (!this.paused && (this.begin + (timestamp - this._previousTimestamp)) > this.end) {
      this.reset()
      this._previousTimestamp = timestamp

      return this.production
    }

    return false
  }

  /**
   * Get this building's cost to build.
   *
   * @returns {{food: Number, wood: Number, rock: Number}}
   */
  getCost () {
    return this.cost
  }

  assignWorker () {
    this.emit('worker.request', this)
  }

  removeWorker () {
    this.emit('worker.free', this)
  }
}