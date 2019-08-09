import BaseBuilding from './BaseBuilding'

/**
 * Logic for the Field building.
 *
 * @extends BaseBuilding
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Field extends BaseBuilding {
  /**
   * @inheritDoc
   */
  static info () {
    return {
      id: 112,
      name: 'Field',
      component: 'building-info',
      cost: { food: 10, wood: 20 },
      production: { food: 50 },
      time: 10, // TODO: increase after testing
      icon: {
        image: '/static/tileset.png',
        x: -(128 * 3),
        y: -(128 * 6)
      }
    }
  }

  /**
   * @param {Object} config - GrassTile component config
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // deep-clone info to prevent changing the default from
    // an instance by reference (child objects)
    const info = JSON.parse(JSON.stringify(Field.info()))
    super(Object.assign(info, config))
  }
}
