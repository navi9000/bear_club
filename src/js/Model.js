import "./utils/types"
import store from "./Store"

class Model {
  /**
   *
   * @param {number | string | object} params
   * @param {function} callback
   */
  read(params, callback) {
    if (typeof params === "string" || typeof params === "number") {
      const id = +params
      if (isNaN(id)) {
        console.error(`Invalid id: ${params}`)
        return
      }
      store.getBear(id, callback)
    } else if (params && typeof params === "object") {
      store.getBears(params, callback)
    } else {
      console.error("Something went wrong")
    }
  }

  /**
   *
   * @param {string | number} id
   * @param {"accept" | "reject"} type
   * @param {function} callback
   */
  update(id, type, callback) {
    const idAsNum = +id
    if (isNaN(idAsNum)) {
      console.error(`Invalid id: ${id}`)
      return
    }
    if (type === "accept") {
      store.acceptBear(idAsNum, callback)
    } else if (type === "reject") {
      store.rejectBear(idAsNum, callback)
    } else {
      console.error("Something went wrong")
    }
  }
}

export default Model
