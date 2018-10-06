import GrassTile from './GrassTile.js'

/**
 * Instantiate one for each tile class.
 * This is where tile singletons are created.
 */

const Grass = new GrassTile({ id: 1, element: document.getElementById('buildings-menu') })

export { Grass }
