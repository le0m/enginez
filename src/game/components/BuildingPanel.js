import BaseElement from '../../engine/BaseElement.js'

class BuildingPanel extends BaseElement {
  /**
   * @typedef BuildingInfo
   * @property {String} name
   * @property {String} picture - Relative path
   * @property {String} description
   * @property {String[]} [information] - Bullet points of information
   * @property {Array<BuildingAbility>} [abilities]
   * @property {Number} [workers]
   * @property {Number} [maxWorkers]
   */

  /**
   * @typedef BuildingAbility
   * @property {String} name - Unique ability name
   * @property {String} icon - Relative path to image
   * @property {String} text - Ability description
   */

  /**
   * Create the element and attach the shadow root.
   */
  constructor () {
    super()

    this._handlers = new Map()

    // attach shadow root
    this.attachShadow({ mode: 'open' })
    const template = document.getElementById('building-template')
    const templateClone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(templateClone)
  }

  /**
   * @inheritDoc
   *
   * @param {BuildingInfo} info - Information of this building
   * @fires BuildingPanel#menu-close
   * @fires BuildingPanel#menu-ability
   * @fires BuildingPanel#menu-add-worker
   * @fires BuildingPanel#menu-remove-worker
   */
  init (info) {
    // block click on component from reaching game canvas
    this._handlers.set(this.shadowRoot, (event) => event.stopPropagation())

    /**
     * @event BuildingPanel#menu-close
     * @type CustomEvent
     */
    this._handlers.set(this.shadowRoot.querySelector('.navigation .close'), (event) => {
      if (this.debug) {
        console.log(`[MENU][building info] closing menu`)
      }

      event.stopPropagation()
      this.dispatchEvent(new CustomEvent('menu:close'))
    })

    const name = this.shadowRoot.querySelector('.title.name')
    name.innerText = info.name

    const picture = this.shadowRoot.querySelector('.img.picture')
    picture.src = info.picture

    const description = this.shadowRoot.querySelector('.content.description')
    description.innerText = info.description

    const information = this.shadowRoot.querySelector('.info ul')

    // clear all
    while (information.lastChild) {
      information.removeChild(information.lastChild)
    }

    for (const point of info.information) {
      const item = document.createElement('li')
      item.innerText = point
      information.appendChild(item)
    }

    // show information if available
    if (info.information.length === 0) {
      this.shadowRoot.querySelector('.row.info').classList.add('hide')
    } else {
      this.shadowRoot.querySelector('.row.info').classList.remove('hide')
    }

    const abilities = this.shadowRoot.querySelector('.abilities .content')

    // clear all
    while (abilities.lastChild) {
      abilities.removeChild(abilities.lastChild)
    }

    for (const ability of info.abilities) {
      const elem = document.createElement('div')
      elem.classList.add('item', 'click')

      /**
       * @event BuildingPanel#menu-ability
       * @type CustomEvent
       * @property {BuildingAbility} details
       */
      this._handlers.set(elem, (event) => {
        if (this.debug) {
          console.log(`[MENU][building info] using ability: ${ability.name}`)
        }

        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('menu:ability', { detail: ability }))
      })

      const icon = document.createElement('img')
      icon.src = ability.icon
      icon.classList.add('icon')
      elem.appendChild(icon)

      const text = document.createElement('span')
      text.innerText = ability.text
      text.classList.add('text')
      elem.appendChild(text)

      abilities.appendChild(elem)
    }

    // show abilities if available
    if (info.abilities.length === 0) {
      this.shadowRoot.querySelector('.abilities').classList.add('hide')
    } else {
      this.shadowRoot.querySelector('.abilities').classList.remove('hide')
    }

    // show workers if available
    if (info.maxWorkers > 0) {
      /**
       * @event BuildingPanel#menu-add-worker
       * @type CustomEvent
       */
      this._handlers.set(this.shadowRoot.querySelector('.workers .add'), (event) => {
        if (this.debug) {
          console.log(`[MENU][building info] adding worker`)
        }

        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('menu:add-worker'))
      })

      const workers = this.shadowRoot.querySelector('.workers .current')
      workers.innerText = info.workers

      const maxWorkers = this.shadowRoot.querySelector('.workers .max')
      maxWorkers.innerText = info.maxWorkers

      /**
       * @event BuildingPanel#menu-remove-worker
       * @type CustomEvent
       */
      this._handlers.set(this.shadowRoot.querySelector('.workers .remove'), (event) => {
        if (this.debug) {
          console.log(`[MENU][building info] removing worker`)
        }

        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('menu:remove-worker'))
      })
    }

    this._attachHandlers()
  }

  /**
   * @inheritDoc
   *
   * @param {BuildingInfo} info - Information of this building
   */
  update (info) {
    this._detachHandlers()
    this._handlers.clear()
    this.init(info)
  }

  /**
   * Attach event handlers to their elements.
   *
   * @private
   */
  _attachHandlers () {
    for (const [element, handler] of this._handlers) {
      element.addEventListener('click', handler)
    }
  }

  /**
   * Detach event handlers from their elements.
   *
   * @private
   */
  _detachHandlers () {
    for (const [element, handler] of this._handlers) {
      element.removeEventListener('click', handler)
    }
  }
}

try {
  window.customElements.define('building-panel', BuildingPanel)
} catch (e) {
  console.error(`Custom elements not supported by the browser!`)
}
