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

/**
 *
 * @param {string} name
 */
function getSearchParam(name) {
  const searchParams = new URLSearchParams(window.location.search)
  const value = searchParams.get(name)
  if (value === "true") {
    return true
  } else if (!isNaN(+value)) {
    return +value
  } else if (new RegExp(",").test(value)) {
    const valueAsArr = value.split(",").map((item) => {
      if (!isNaN(+item)) {
        return +item
      }
      return item
    })
    return valueAsArr
  } else {
    return null
  }
}

/**
 *
 * @param {string} name
 */
export function srchP(name) {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(name)
}

export function parseSearchParams() {
  return {
    reserve: getSearchParam("reserve"),
    selection: getSearchParam("selection"),
    opened: getSearchParam("opened"),
  }
}
