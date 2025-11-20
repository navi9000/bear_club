const SERVER_ROOT = "https://private-9d5e37a-testassignment.apiary-mock.com"
const SERVER_ROOT_2 =
  "https://private-dd610-ruporttestassignment.apiary-mock.com"
const CACHE_NAME = "bearclub.com-v1"

/**
 *
 * @param {string} endpoint
 */
async function query(endpoint, isSecondServer = false) {
  try {
    const root = isSecondServer ? SERVER_ROOT_2 : SERVER_ROOT
    const queryRoot = root.concat(endpoint)

    const match = await caches.match(queryRoot)
    if (match) {
      return match.json()
    }

    const res = await fetch(queryRoot)
    if (!res.ok) {
      throw res.statusText
    }
    const cache = await caches.open(CACHE_NAME)
    cache.put(queryRoot, res.clone())

    const json = await res.json()
    return json
  } catch (e) {
    let message
    if (e instanceof Error) {
      message = e.message
    } else if (typeof e === "string") {
      message = e
    } else {
      message = "Unknown error"
    }
    return null
  }
}

/**
 *
 * @param {string} endpoint
 * @param {object} params
 * @param {"POST" | "PUT" | "DELETE"} method
 */
async function mutation(endpoint, params = {}, method = "POST") {
  try {
    const res = await fetch(SERVER_ROOT.concat(endpoint), {
      method,
      body: JSON.stringify(params),
    })
    if (!res.ok) {
      throw res.statusText
    }
    const json = await res.json()
    return json
  } catch (e) {
    let message
    if (e instanceof Error) {
      message = e.message
    } else if (typeof e === "string") {
      message = e
    } else {
      message = "Unknown error"
    }
    console.error(message)
  }
}

export async function getBears() {
  const serverData = await query("/get-bears")
  if (serverData && serverData.success) {
    /**
     * @type {[Bear]}
     */
    const data = serverData.results.data
    return data
  }
}

/**
 *
 * @param {number} id
 */
export async function getBearById(id) {
  const serverData = await query(`/get-bears/${id}`, true)
  if (serverData && serverData.success) {
    /**
     * @type {Bear}
     */
    const data = serverData.data
    return data
  }
}

/**
 *
 * @param {number} id
 */
export async function acceptBear(id) {
  return mutation(`/resolve-bear`)
}

/**
 *
 * @param {number} id
 */
export async function rejectBear(id) {
  return mutation(`/reject-bear`)
}
