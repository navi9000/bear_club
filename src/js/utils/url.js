/**
 *
 * @param {string} name
 * @param {any} value
 */
export function setSearchParam(name, value) {
  const searchParams = new URLSearchParams(window.location.search)
  if (Array.isArray(value) && value.length) {
    searchParams.set(name, value.join(","))
  } else if (typeof value === "number") {
    searchParams.set(name, value.toString())
  } else if (typeof value === "string") {
    searchParams.set(name, value)
  } else if (value === true) {
    searchParams.set(name, "true")
  } else {
    searchParams.delete(name)
  }

  const stringifiedSearchParams = searchParams.toString()
  let newUrl = window.location.pathname
  if (stringifiedSearchParams) {
    newUrl = newUrl.concat("?", stringifiedSearchParams)
  }

  window.history.replaceState(window.history.state, "", newUrl)
}
