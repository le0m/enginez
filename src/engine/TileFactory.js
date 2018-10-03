import BaseTile from './BaseTile'

/**
 * Factory to store tile objects constructors and instances (singleton).
 */
const TileFactory = {
  _tiles: new Map(),
  _instances: new Map(),

  /**
   * Add a tile class implementation to instantiate
   * later on.
   *
   * @param {String|Number} name - Tile name/ID
   * @param {Object} constructor - The tile class
   */
  add (name, constructor) {
    if (!TileFactory._tiles.has(name) && constructor.prototype instanceof BaseTile) {
      TileFactory._tiles.add(name, constructor)
    }
  },

  /**
   * Create a tile instance.
   * The instance created is stored (see {@link TileFactory#get}).
   * This will override any previous instance.
   *
   * @param {String|Number} name - Tile name/ID
   * @param {Object} config - Tile constructor params
   * @returns {BaseTile|null} - An instance of the tile, or `null` if not found
   */
  create (name, config) {
    if (!TileFactory._tiles.has(name)) {
      console.error(`[TILE FACTORY] required tile ${name} is not mapped`)
      return null
    }

    let constructor = TileFactory._tiles.get(name)
    let instance = new constructor(config)
    TileFactory._instances.set(name, instance)

    return instance
  },

  /**
   * Get a tile instance.
   *
   * @param {String|Number} name - Tile name/ID
   * @returns {BaseTile|null} - An instance of the tile, or `null` if not found
   */
  get (name) {
    if (!TileFactory._instances.has(name)) {
      console.error(`[TILE FACTORY] required tile ${name} is not mapped`)
      return null
    }

    return TileFactory._instances.get(name)
  }
}

export default TileFactory
