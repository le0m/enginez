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
   * Resource object definition.
   *
   * @typedef Resources
   * @property {Number} [food]
   * @property {Number} [wood]
   * @property {Number} [rock]
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
    elem.init(this.resources)
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
   * @param {Number} position[0] - Map column
   * @param {Number} position[1] - Map row
   * @returns {BaseBuilding|Boolean} - Created building instance, or `false` if couldn't build
   */
  build (Building, position) {
    const cost = Building.info().cost

    if (this.spend(cost)) {
      const building = new Building({
        position: position,
        debug: this.debug
      })

      if (this.debug) {
        console.log(`[CITY] building '${building.name}' in position ${building.position[0]} | ${building.position[1]}`)
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
   * @returns {{food: Number, wood: Number, rock: Number}} - Total production, already added to City stash
   */
  production (timestamp) {
    // TODO: this is not working; try building 2+ Fields and see
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
   * Check if the City can afford spending an amount
   * of resources.
   *
   * @param {{food: Number, wood: Number, rock: Number}} amount - Can be one or more resources
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
   * @param {{food: Number, wood: Number, rock: Number}} amount - Can be one or more resources
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
   * @param {{food: Number, wood: Number, rock: Number}} amount - Can be one or more resources
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
   * Update the City header UI component.
   */
  updateHeader () {
    this.element.update(this.resources)
  }
}
