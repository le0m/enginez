import BaseBuilding from './BaseBuilding.js'

/**
 * Logic for the Field building.
 *
 * @extends BaseBuilding
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class FieldTile extends BaseBuilding {
  /**
   * @inheritDoc
   */
  static info () {
    return {
      id: 112,
      name: 'Field',
      component: 'building-panel',
      cost: { food: 10, wood: 20 },
      production: { food: 50 },
      time: 10, // TODO: increase after testing
      maxWorkers: 1,
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
    const info = JSON.parse(JSON.stringify(FieldTile.info()))
    super(Object.assign(info, config))
  }

  /**
   * @inheritDoc
   */
  open (component, state) {
    component.update({
      name: this.name,
      picture: '', // TODO: put in `info()`
      description: 'A farming field to produce food for your population',
      information: [
        'produces 50 food'
      ],
      abilities: [],
      workers: this.workers,
      maxWorkers: this.maxWorkers
    })

    return super.open(component, state)
  }

  /**
   * @inheritDoc
   */
  update (component) {
    component.update({
      name: this.name,
      picture: '', // TODO: put in `info()`
      description: 'A farming field to produce food for your population',
      information: [
        'produces 50 food'
      ],
      abilities: [],
      workers: this.workers,
      maxWorkers: this.maxWorkers
    })

    return super.update(component)
  }

  /**
   * @inheritDoc
   */
  close (component) {
    return super.close(component)
  }

  /**
   * @inheritDoc
   */
  _attachHandlers (component) {
    component.addEventListener('menu:close', this._handleClose.bind(this))
    component.addEventListener('menu:add-worker', this._handleAddWorker.bind(this))
    component.addEventListener('menu:remove-worker', this._handleRemoveWorker.bind(this))
    component.addEventListener('menu:ability', this._handleAbility.bind(this))
  }

  /**
   * @inheritDoc
   */
  _detachHandlers (component) {
    component.removeEventListener('menu:close', this._handleClose.bind(this))
    component.removeEventListener('menu:add-worker', this._handleAddWorker.bind(this))
    component.removeEventListener('menu:remove-worker', this._handleRemoveWorker.bind(this))
    component.removeEventListener('menu:ability', this._handleAbility.bind(this))
  }

  /**
   * Handle close menu event.
   *
   * @param {CustomEvent} event
   * @listens BuildingPanel#event:menu-close
   * @fires FieldTile#tile-close
   * @private
   */
  _handleClose (event) {
    event.stopPropagation()

    /**
     * @event FieldTile#tile-close
     * @type Object
     * @property {BuildingState} state - Current Building state
     */
    this.emit('tile:close', {
      state: this.getState()
    })
  }

  /**
   * Handle worker add button.
   *
   * @param {CustomEvent} event
   * @listens BuildingPanel#event:menu-add-worker
   * @fires BaseBuilding#building-add-worker
   * @private
   */
  _handleAddWorker (event) {
    event.stopPropagation()

    /**
     * @event BaseBuilding#building-add-worker
     * @type Object
     * @property {BaseBuilding} building - Building instance
     */
    this.emit('building:add-worker', {
      building: this
    })
  }

  /**
   * Handle worker remove button.
   *
   * @param {CustomEvent} event
   * @listens BuildingPanel#event:menu-remove-worker
   * @fires BaseBuilding#building-remove-worker
   * @private
   */
  _handleRemoveWorker (event) {
    event.stopPropagation()

    /**
     * @event BaseBuilding#building-remove-worker
     * @type Object
     * @property {BaseBuilding} building - Building instance
     */
    this.emit('building:remove-worker', {
      building: this
    })
  }

  /**
   * Handle ability button.
   *
   * @param {CustomEvent} event
   * @param {BuildingAbility} event.detail - Ability info
   * @listens BuildingPanel#event:menu-ability
   * @fires FieldTile#building-ability
   * @private
   */
  _handleAbility (event) {
    event.stopPropagation()

    /**
     * @event FieldTile#building-ability
     * @type Object
     * @property {BuildingAbility} ability
     */
    this.emit('building:ability', {
      ability: event.detail
    })
  }
}
