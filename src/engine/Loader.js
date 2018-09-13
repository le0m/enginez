/**
 * Pre-loads images, asynchronously (as-if this supports more than one...).
 */
export default class Loader {
  constructor () {
    this.images = {}
  }

  /**
   * Pre-load image in DOM.
   * Returns a promise that will resolve to an `Image` object.
   *
   * @param {string} key
   * @param {string} src
   * @returns {Promise<Image>}
   */
  loadImage (key, src) {
    let img = new window.Image()

    let d = new Promise(function (resolve, reject) {
      img.onload = function () {
        this.images[key] = img
        console.log('Loaded image: ' + img.src)
        resolve(img)
      }.bind(this)

      img.onerror = function () {
        reject('Could not load image: ' + src)
      }
    }.bind(this))

    img.src = src

    return d
  }

  /**
   * Get a pre-loaded `Image` object.
   *
   * @param {string} key
   * @returns {(Image|null)}
   */
  getImage (key) {
    return (key in this.images) ? this.images[key] : null
  }
}
