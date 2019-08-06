import BaseElement from '../../engine/BaseElement.js'

class BuildingsMenu extends BaseElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    const template = document.getElementById('buildings-template')
    const templateClone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(templateClone)
  }

  /**
   * @inheritDoc
   */
  init (buildings) {
    const rootElement = this.shadowRoot.querySelector('.menu .list')

    // clear all
    while (rootElement.lastChild) {
      rootElement.removeChild(rootElement.lastChild)
    }

    // init building list
    for (const building of buildings) {
      const element = document.createElement('li')
      element.classList.add('list-item')

      const card = document.createElement('div')
      card.classList.add('click', 'card')
      element.appendChild(card)

      const cardHeader = document.createElement('div')
      cardHeader.classList.add('card-header', 'size-3')
      cardHeader.innerText = building.name
      card.appendChild(cardHeader)

      const cardBody = document.createElement('div')
      cardBody.classList.add('card-body')
      card.appendChild(cardBody)

      const img = document.createElement('img')
      img.src = '/static/favicon.png'
      cardBody.appendChild(img)

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

      rootElement.appendChild(element)
    }
  }

  /**
   * @inheritDoc
   */
  update (buildings) {
    this.init(buildings)
  }

  _onClick () {}
}

try {
  window.customElements.define('buildings-menu', BuildingsMenu)
} catch (e) {
  console.error(`Custom elements not supported by the browser!`)
}