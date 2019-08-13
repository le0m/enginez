import GrassTile from './GrassTile.js'
import FieldTile from './FieldTile.js'

/**
 * Instantiate one for each tile class.
 * This is where tile singletons are created.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */

const Grass = new GrassTile({ debug: true })
const Field = new FieldTile({ debug: true })

export { Grass, Field }
