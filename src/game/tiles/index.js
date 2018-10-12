import GrassTile from './GrassTile.js'

/**
 * Instantiate one for each tile class.
 * This is where tile singletons are created.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */

const Grass = new GrassTile({ debug: true, id: 1, element: document.getElementById('buildings') })

export { Grass }
