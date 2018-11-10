/* global HTMLElement */

class ResourcesHeader extends HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.addTemplate()
  }

  addTemplate () {
    let template = document.getElementById('resources-template')
    let templateClone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(templateClone)
  }

  createResources (names) {
    let resources = this.shadowRoot.querySelector('.resources')
    // clear all
    while (resources.lastChild) {
      resources.removeChild(resources.lastChild)
    }

    for (let res of names) {
      let resource = document.createElement('div')
      resource.classList.add(res)

      let icon = document.createElement('span')
      icon.classList.add('icon')
      icon.innerText = res.charAt(0).toUpperCase()
      resource.appendChild(icon)

      let value = document.createElement('span')
      value.classList.add('value')
      value.innerText = '--'
      resource.appendChild(value)

      resources.appendChild(resource)
    }
  }

  updateResources (resources) {
    for (let res in resources) {
      if (resources.hasOwnProperty(res)) {
        let elem = this.shadowRoot.querySelector(`.${res} .value`)

        if (!elem) {
          console.warn(`[COMPONENT][resources-header] No UI element for resource ${res}. Did you declare it in the component options?`)
          return false
        }

        elem.innerText = `${resources[res]}` // cast to string
      }
    }
  }
}

try {
  window.customElements.define('resources-header', ResourcesHeader)
} catch (e) {
  console.error(`Custom elements not supported by the browser!`)
}
