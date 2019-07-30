/* global HTMLElement */

class CityHeader extends HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    const template = document.getElementById('city-header-template')
    const templateClone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(templateClone)
  }

  resourcesTemplate (names) {
    const resources = this.shadowRoot.querySelector('.resources')
    // clear all
    while (resources.lastChild) {
      resources.removeChild(resources.lastChild)
    }

    for (const res of names) {
      const resource = document.createElement('div')
      resource.classList.add(res)

      const icon = document.createElement('span')
      icon.classList.add('icon')
      icon.innerText = res.charAt(0).toUpperCase()
      resource.appendChild(icon)

      const value = document.createElement('span')
      value.classList.add('value')
      value.innerText = '--'
      resource.appendChild(value)

      resources.appendChild(resource)
    }
  }

  updateResources (resources) {
    for (const res of Object.keys(resources)) {
      const elem = this.shadowRoot.querySelector(`.${res} .value`)

      if (!elem) {
        console.warn(`[COMPONENT][resources-header] No UI element for resource ${res}. Did you declare it with "resourcesTemplate()"?`)
        return false
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
