import "./types"

/**
 *
 * @param {ProjectSearchParam} name
 * @param {any} value
 */
export function setSP(name, value) {
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

/**
 *
 * @param {ProjectSearchParam} name
 */
export function getSP(name) {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(name)
}

/**
 *
 * @param {ProjectSearchParam} name
 */
export function parseSP(name) {
  const value = getSP(name)
  switch (name) {
    case "open":
      return value ? +value : null
    case "reserve":
      return value === "true"
    case "selection":
      return value ?? "incoming"
    default:
      console.error(`Unknown search parameter: ${name}`)
      return null
  }
}
