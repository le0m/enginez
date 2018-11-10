/* global HTMLElement */

class ResourcesHeader extends HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.addStyle()
    this.addTemplate()
  }

  addTemplate () {
    let wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'resources')
    wrapper.classList.add('header')
    this.shadowRoot.appendChild(wrapper)

    let resources = document.createElement('div')
    resources.classList.add('resources')
    wrapper.appendChild(resources)
  }

  addStyle () {
    let style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
      }
      
      .header {
          padding: 20px;
      }
      
      .header .resources {
          box-sizing: border-box;
          background-color: #ffffff;
          padding: 0.8rem;
      }
      
      .resources div {
          display: inline-block;
      }
    `
    this.shadowRoot.appendChild(style)
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
