import BaseElement from '../../engine/BaseElement.js'

class BuildingsMenu extends BaseElement {
  /**
   * Create the element and attach the shadow root.
   */
  constructor () {
    super()

    this._handlers = new Map()

    // attach shadow root
    this.attachShadow({ mode: 'open' })
    const template = document.getElementById('buildings-template')
    const templateClone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(templateClone)
  }

  /**
   * @inheritDoc
   *
   * @param {Array<BaseBuilding>} buildings
   * @fires BuildingsMenu#menu-close
   * @fires BuildingsMenu#menu-build
   */
  init (buildings) {
    const list = this.shadowRoot.querySelector('.menu .list')

    // block click on component from reaching game canvas
    this._handlers.set(this.shadowRoot, (event) => event.stopPropagation())

    /**
     * @event BuildingsMenu#menu-close
     * @type CustomEvent
     */
    this._handlers.set(this.shadowRoot.querySelector('.navigation .close'), (event) => {
      if (this.debug) {
        console.log(`[MENU][buildings] closing menu`)
      }

      event.stopPropagation()
      this.dispatchEvent(new CustomEvent('menu:close'))
    })

    // clear all
    while (list.lastChild) {
      list.removeChild(list.lastChild)
    }

    // init building list
    for (const building of buildings) {
      const listItem = document.createElement('li')
      listItem.classList.add('list-item')

      const card = document.createElement('div')
      card.classList.add('click', 'card')
      /**
       * @event BuildingsMenu#menu-build
       * @type CustomEvent
       * @property {BaseBuilding} detail - Clicked building
       */
      this._handlers.set(card, (event) => {
        if (this.debug) {
          console.log(`[MENU][buildings] clicked building:`, building)
        }

        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('menu:build', { detail: building }))
      })
      listItem.appendChild(card)

      const cardHeader = document.createElement('div')
      cardHeader.classList.add('card-header', 'size-3')
      cardHeader.innerText = building.name
      card.appendChild(cardHeader)

      const cardBody = document.createElement('div')
      cardBody.classList.add('card-body')
      card.appendChild(cardBody)

      const icon = document.createElement('div')
      icon.style.display = 'inline-block'
      icon.style.width = '128px'
      icon.style.height = '128px'
      icon.style.background = 'url(/static/tileset.png)'
      icon.style.backgroundPosition = `${building.icon.x}px ${building.icon.y}px`
      cardBody.appendChild(icon)

      const cardFooter = document.createElement('div')
      cardFooter.classList.add('card-footer')
      card.appendChild(cardFooter)

      const resources = document.createElement('div')
      resources.classList.add('resources', 'invert')
      cardFooter.appendChild(resources)

      // init building cost
      for (const res of Object.keys(building.cost)) {
        const elem = document.createElement('div')
        elem.classList.add(res)
        resources.appendChild(elem)

        const icon = document.createElement('span')
        icon.classList.add('icon')
        icon.innerText = res.charAt(0).toUpperCase()
        elem.appendChild(icon)

        const value = document.createElement('span')
        value.classList.add('value', 'size-4')
        value.innerText = `${building.cost[res]}`
        elem.appendChild(value)
      }

      list.appendChild(listItem)
    }

    this._attachHandlers()
  }

  /**
   * @inheritDoc
   *
   * @param {Array<BaseBuilding>} buildings
   */
  update (buildings) {
    this._detachHandlers()
    this._handlers.clear()
    this.init(buildings)
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
  window.customElements.define('buildings-menu', BuildingsMenu)
} catch (e) {
  console.error(`Custom elements not supported by the browser!`)
}
