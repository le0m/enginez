import EventEmitter from '../engine/EventEmitter.js'

/**
 * Logic for the City, production and management.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class City extends EventEmitter {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * Game resources.
   *
   * @typedef Resources
   * @property {Number} [food]
   * @property {Number} [wood]
   * @property {Number} [rock]
   */

  /**
   * City information.
   *
   * @typedef CityInfo
   * @property {Resources} resources
   * @property {Number} workers
   * @property {Number} population
   */

  /**
   * @param {Object} config - City component configuration
   * @param {UI} config.ui - {@link UI} component instance
   * @param {Resources} config.resources - Initial resources
   * @param {Number} config.population - Initial population (int)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super(config)

    this.ui         = config.ui
    this.resources  = config.resources || { food: 100, wood: 100, rock: 100 }
    this.population = config.population
    this.workers    = 0
    /** @type {Array<BaseBuilding>} */
    this.buildings  = []
    this.element    = this._initHeader()

    // other
    this.debug      = config.debug || false
  }

  /**
   * Initialize header HTML component.
   *
   * @returns {BaseElement} - The HTML component
   * @private
   */
  _initHeader () {
    /** @type {BaseElement} */
    const elem = this.ui.components.get('city-header')
    elem.init({
      resources: this.resources,
      workers: this.workers,
      population: this.population
    })
    elem.classList.remove('hide')

    return elem
  }

  /**
   * Add a building to the City.
   *
   * Validates the building cost.
   *
   * @param {BaseBuilding.} Building - Class definition of the Building to check and add
   * @param {Number[]} position
   * @param {Number} position[0] - Map layer
   * @param {Number} position[1] - Map column
   * @param {Number} position[2] - Map row
   * @returns {BaseBuilding|Boolean} - Created building instance, or `false` if couldn't build
   */
  build (Building, position) {
    const cost = Building.info().cost

    if (this.spend(cost)) {
      const building = new Building({ debug: this.debug })

      building.setState({
        layer: position[0],
        col: position[1],
        row: position[2]
      })

      if (this.debug) {
        console.log(`[CITY] building '${building.name}' in position ${position[1]} | ${position[2]} (${position[0]})`)
      }

      this.buildings.push(building)

      return building
    }

    return false
  }

  /**
   * Trigger production of all City buildings.
   * Produced resources are added to the City stash.
   *
   * @param {Number} timestamp - Time since start (int, ms)
   * @returns {Resources} - Total production, already added to City stash
   */
  production (timestamp) {
    const total = this.buildings.reduce((production, building) => {
      const produced = building.produce(timestamp)

      if (produced) {
        for (const resource of Object.keys(produced)) {
          production[resource] += produced[resource]
        }
      }

      return production
    }, { food: 0, wood: 0, rock: 0 })

    // check if any resource was produced
    if (Object.keys(total).filter((key) => total[key] > 0).length > 0) {
      if (this.debug) {
        console.log(`[CITY] production:`, total)
      }

      this.gain(total)
    }

    return total
  }

  /**
   * Check if the City can afford spending an amount of resources.
   *
   * @param {Resources} amount - Can be one or more resources
   * @returns {Boolean}
   */
  canAfford (amount) {
    let affordable = true

    for (const resource of Object.keys(amount)) {
      if (this.resources[resource] < amount[resource]) {
        affordable = false
        break
      }
    }

    return affordable
  }

  /**
   * Spend an amount of City resources.
   *
   * @param {Resources} amount - Can be one or more resources
   * @returns {Boolean} - `false` if the City can't afford the amount of resources
   */
  spend (amount) {
    if (!this.canAfford(amount)) {
      return false
    }

    for (const resource of Object.keys(amount)) {
      this.resources[resource] -= amount[resource]
    }

    this.updateHeader()

    return true
  }

  /**
   * Add an amount of resources to the City stash.
   *
   * @param {Resources} amount - Can be one or more resources
   */
  gain (amount) {
    for (const resource of Object.keys(amount)) {
      if (amount[resource] > 0) {
        this.resources[resource] += amount[resource]
      }
    }

    this.updateHeader()
  }

  /**
   * Get a City's building at some specific position, if available.
   *
   * @param {Number} layer
   * @param {Number} col
   * @param {Number} row
   */
  getBuildingAt (layer, col, row) {
    let bInfo = null

    return this.buildings.find((building) => {
      bInfo = building.getState()
      return bInfo.layer === layer && bInfo.col === col && bInfo.row === row
    })
  }

  /**
   * Assign a worker to a building.
   *
   * @param {BaseBuilding} building
   * @return {Boolean} - Success of assignment
   */
  assignWorker (building) {
    if (this.population <= this.workers) {
      return false
    }

    if (building.assignWorker()) {
      this.workers++
      this.updateHeader()

      return true
    }

    return false
  }

  /**
   * Remove a worker from a building.
   *
   * @param {BaseBuilding} building
   * @return {Boolean} - Success of removal
   */
  removeWorker (building) {
    if (building.removeWorker()) {
      this.workers--
      this.updateHeader()

      return true
    }

    return false
  }

  /**
   * Update the City header UI component.
   */
  updateHeader () {
    this.element.update({
      resources: this.resources,
      workers: this.workers,
      population: this.population
    })
  }
}
