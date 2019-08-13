/* global HTMLElement */

/**
 * This is the base class for custom web elements.
 *
 * Override the following methods:
 * - `constructor()`, to attach the shadow root
 * - `init()`, to initialize the element inner DOM
 * - `update()`, to update the element inner DOM
 *
 * The custom element must be registered after class definition:
 * ```js
 * try {
 *   window.customElements.define('my-custom-element', MyCustomElement)
 * } catch (e) {
 *   console.error(`Custom elements not supported by the browser!`)
 * }
 * ```
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseElement extends HTMLElement {
  constructor () {
    super()

    this.debug = false
  }

  /**
   * Create dynamic parts of the component template.
   *
   * @param {*} data - Data used by the component to build the template
   */
  init (data) {}

  /**
   * Update dynamic parts of the component template.
   *
   * @param {*} data - Data used by the component to update the template
   */
  update (data) {}
}
