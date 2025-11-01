const SERVER_ROOT = "https://private-9d5e37a-testassignment.apiary-mock.com"

/**
 *
 * @param {string} endpoint
 */
async function query(endpoint) {
  try {
    const res = await fetch(SERVER_ROOT.concat(endpoint))
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
    console.log(message)
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
    console.log(message)
    return null
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
  return null
}

/**
 *
 * @param {number} id
 */
export async function getBearById(id) {
  const serverData = await query(`/get-bears/${id}`)
  if (serverData && serverData.success) {
    /**
     * @type {Bear}
     */
    const data = serverData.data
    return data
  }
  return null
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
