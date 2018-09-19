/**
 * Engine core class, manages all components.
 * You need to extend this class and override loop methods.
 */
export default class Engine {
  /**
   * @param {Object} config
   */
  constructor (config) {
    this._previousElapsed = 0

    this.options = config || {} // add here default options
  }

  /**
   * Start the game engine loop:
   * 1. load
   * 2. init
   * 3. start loop
   *
   * @returns {Promise<>}
   */
  run () {
    return Promise.all(this.load())
      .then(() => {
        this.init()
        window.requestAnimationFrame(this.tick.bind(this))
      })
  }

  /**
   * Executes a tick of the game:
   * 1. clear frame
   * 2. calculate delta
   * 3. update
   * 4. render
   *
   * @param {number} elapsed
   */
  tick (elapsed) {
    window.requestAnimationFrame(this.tick.bind(this))
    // round to 3 decimals
    elapsed = (elapsed * 1000 | 0) / 1000

    // compute delta
    let delta = (elapsed - this._previousElapsed) / 1000
    delta = Math.min(0.250, delta) // cap delta for a more consistent behavior
    this._previousElapsed = elapsed

    this.update(delta)
    this.render()
  }

  /**
   * Override to pre-load resources.
   * Must return one Promise or an array of them.
   *
   * @return {Promise<any>}
   */
  load () {
    return Promise.reject(new Error('Method not implemented: load()'))
  }

  /**
   * Override to initialize other components.
   */
  init () {
    throw Error('Method not implemented: init()')
  }

  /**
   * Override to handle state updates (ex. movement,
   * input, tile updates, ...).
   *
   * @param {number} delta
   */
  update (delta) {
    throw Error('Method not implemented: update()')
  }

  /**
   * Override to (re-)draw layers and canvas.
   */
  render () {
    throw Error('Method not implemented: render()')
  }
}
