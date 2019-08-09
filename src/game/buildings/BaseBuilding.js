import BaseTile from '../../engine/BaseTile.js'

/**
 * Base Building logic.
 *
 * @extends BaseTile
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseBuilding extends BaseTile {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * Building UI icon object definition.
   *
   * @typedef BuildingIcon
   * @property {String} image - Icon sprite image relative path
   * @property {Number} x - Icon position on the sprite
   * @property {Number} y - Icon position on the sprite
   */

  /**
   * Building information.
   *
   * @typedef BuildingInfo
   * @property {Number} id
   * @property {String} name
   * @property {String} component
   * @property {Resources} cost
   * @property {Resources} production
   * @property {Number} time
   * @property {BuildingIcon} icon
   */

  /**
   * Building info, used by UI to show menu and constructor to initialize properties.
   *
   * @return {BuildingInfo}
   */
  static info () {}

  /**
   * @param {Object} config - BaseBuilding component configuration
   * @param {Resources} config.cost - Resources cost to build
   * @param {Resources} config.production - Building production
   * @param {Number} config.time - Production time (int, s)
   * @param {Number[]} config.position - Building position on map, [0] is column and [1] is row
   * @param {BuildingIcon} config.icon - Icon sprite and position, for UI icon of this building
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super(config)

    this.cost               = config.cost
    this.production         = config.production
    this.time               = config.time * 1000
    this.position           = config.position || null // building position on the map (col, row)
    this.icon               = config.icon
    this.begin              = Date.now()
    this.end                = this.begin + this.time
    this._previousTimestamp = 0
    this.paused             = false
    this.workers            = 0
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
   * @returns {Resources|Boolean} - Resource production, or `false` if not ready
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
   * @returns {Resources}
   */
  getCost () {
    return this.cost
  }

  /**
   * Assign a worker to the building.
   *
   * @return {Boolean} - Success of assignment
   */
  assignWorker () {
    this.workers++

    return true
  }

  /**
   * Remove a worker from the building.
   *
   * @return {Boolean} - Success of removal
   */
  removeWorker () {
    if (this.workers > 0) {
      this.workers--

      return true
    }

    return false
  }
}
