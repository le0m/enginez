import BaseElement from '../../engine/BaseElement.js'

class CityHeader extends BaseElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    const template = document.getElementById('city-header-template')
    const templateClone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(templateClone)
  }

  /**
   * @inheritDoc
   */
  init (resources) {
    const list = this.shadowRoot.querySelector('.resources')

    // clear all
    while (list.lastChild) {
      list.removeChild(list.lastChild)
    }

    for (const res of Object.keys(resources)) {
      const resource = document.createElement('div')
      resource.classList.add(res)

      const icon = document.createElement('span')
      icon.classList.add('icon')
      icon.innerText = res.charAt(0).toUpperCase()
      resource.appendChild(icon)

      const value = document.createElement('span')
      value.classList.add('value')
      value.innerText = `${resources[res]}`
      resource.appendChild(value)

      list.appendChild(resource)
    }
  }

  /**
   * @inheritDoc
   */
  update (resources) {
    for (const res of Object.keys(resources)) {
      const elem = this.shadowRoot.querySelector(`.${res} .value`)

      if (!elem) {
        console.warn(`[COMPONENT][resources-header] No UI element for resource ${res}. Did you declare it with init() ?`)
        continue
      }

      elem.innerText = `${resources[res]}` // cast to string
    }
  }
}

try {
  window.customElements.define('city-header', CityHeader)
} catch (e) {
  console.error(`Custom elements not supported by the browser!`)
}
