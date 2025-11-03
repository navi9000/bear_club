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
 *
 * @param {HTMLElement | Document | Window} target
 * @param {string} event
 * @param {function} callback
 */
export function on(target, event, callback) {
  target.addEventListener(event, callback)
}

export function delegate(target, selector, event, callback) {
  function dispatchEvent(e) {
    const targetElement = e.target.closest(selector)
    const elementList = qsa(selector, target)
    const hasMatch = [...elementList].includes(targetElement)
    if (hasMatch) {
      callback.call(targetElement, e)
    }
  }
  on(target, event, dispatchEvent)
}
