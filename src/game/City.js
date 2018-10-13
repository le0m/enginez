/**
 * Logic for the City, production and management.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class City {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - City component configuration
   * @param {Object} config.resources - Initial resources ({food: Number, wood: Number, rock: Number})
   * @param {Number} config.population - Initial population (int)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.resources  = config.resources || { food: 100, wood: 100, rock: 100 }
    this.population = config.population
    this.workers    = 0
    this.buildings  = []

    // other
    this.debug      = config.debug || false
  }

  build (building) {
    let cost = building.getCost()

    if (this.spend(cost)) {
      this.buildings.push(building)

      return true
    }

    return false
  }

  production (timestamp) {
    let total = this.buildings.reduce((production, building) => {
      let produced = building.produce(timestamp)

      if (produced) {
        for (let resource in produced) {
          if (produced.hasOwnProperty(resource)) {
            production[resource] += produced[resource]
          }
        }
      }
    }, { food: 0, wood: 0, rock: 0 })

    this.gain(total)

    return total
  }

  canAfford (amount) {
    let affordable = true

    for (let resource in amount) {
      if (amount.hasOwnProperty(resource)) {
        if (this.resources[resource] < amount[resource]) {
          affordable = false
          break
        }
      }
    }

    return affordable
  }

  spend (amount) {
    if (!this.canAfford(amount)) {
      return false
    }

    for (let resource in amount) {
      if (amount.hasOwnProperty(resource)) {
        this.resources[resource] -= amount[resource]
      }
    }

    return true
  }

  gain (amount) {
    for (let resource in amount) {
      if (amount.hasOwnProperty(resource)) {
        this.resources[resource] += amount[resource]
      }
    }
  }
}
