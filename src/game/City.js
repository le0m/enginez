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
   * @param {Object} config - City component configuration
   * @param {UI} config.ui - {@link UI} component instance
   * @param {Object} config.resources - Initial resources ({food: Number, wood: Number, rock: Number})
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
   * @param {BaseBuilding} building - The Building component to check and add
   * @returns {Boolean} - Whether the building was added or not
   */
  build (building) {
    const cost = building.getCost()

    if (this.spend(cost)) {
      if (this.debug) {
        console.log(`[CITY] building '${building.name}'`)
      }

      this.buildings.push(building)

      return true
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

  updateHeader () {
    this.element.update(this.resources)
  }
}
