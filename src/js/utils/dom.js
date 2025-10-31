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
