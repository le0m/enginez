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
   *
   * @param {CityInfo} info
   */
  init (info) {
    const list = this.shadowRoot.querySelector('.resources')

    // clear all
    while (list.lastChild) {
      list.removeChild(list.lastChild)
    }

    for (const res of Object.keys(info.resources)) {
      const resource = document.createElement('div')
      resource.classList.add(res)

      const icon = document.createElement('span')
      icon.classList.add('icon')
      icon.innerText = res.charAt(0).toUpperCase()
      resource.appendChild(icon)

      const value = document.createElement('span')
      value.classList.add('value')
      value.innerText = `${info.resources[res]}`
      resource.appendChild(value)

      list.appendChild(resource)
    }

    const workers = this.shadowRoot.querySelector('.population .workers')
    workers.innerText = info.workers

    const population = this.shadowRoot.querySelector('.population .total')
    population.innerText = info.population
  }

  /**
   * @inheritDoc
   *
   * @param {CityInfo} info
   */
  update (info) {
    for (const res of Object.keys(info.resources)) {
      const elem = this.shadowRoot.querySelector(`.${res} .value`)

      if (!elem) {
        console.warn(`[COMPONENT][resources-header] No UI element for resource ${res}. Did you declare it with init() ?`)
        continue
      }

      elem.innerText = `${info.resources[res]}` // cast to string
    }

    const workers = this.shadowRoot.querySelector('.population .workers')
    workers.innerText = info.workers

    const population = this.shadowRoot.querySelector('.population .total')
    population.innerText = info.population
  }
}

try {
  window.customElements.define('city-header', CityHeader)
} catch (e) {
  console.error(`Custom elements not supported by the browser!`)
}
