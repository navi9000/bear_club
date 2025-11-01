/**
 *
 * @param {string} querySelector
 * @param {HTMLElement | Document} target
 */
export function qs(querySelector, target = document) {
  return target.querySelector(querySelector)
}

/**
 *
 * @param {string} querySelector
 * @param {HTMLElement | Document} target
 */
export function qsa(querySelector, target = document) {
  return target.querySelectorAll(querySelector)
}

/**
 * @type {[[HTMLElement | Document | Window, string, function]]}
 */
let destructibleListeners = []

/**
 *
 * @param {string} event
 * @param {HTMLElement | Document | Window} target
 * @param {function} callback
 */
export function on(event, target, callback, isDesctructible = false) {
  target.addEventListener(event, callback)
  if (isDesctructible) {
    destructibleListeners.push([target, event, callback])
  }
}

export function clearSavedListeners() {
  destructibleListeners.forEach(([target, event, callback]) => {
    target.removeEventListener(event, callback)
  })
  destructibleListeners = []
}
