import "./utils/types"
import { getBears, getBearById, acceptBear, rejectBear } from "./utils/http"

class Store {
  /**
   * @type {[Bear]=}
   */
  #bearList
  #bearItems = {}
  #bearStatus = {
    /**
     * @type {[number]}
     */
    accepted: [],
    /**
     * @type {[number]}
     */
    rejected: [],
  }

  /**
   *
   * @param {object} query
   * @param {function} callback
   */
  async getBears(query, callback) {
    if (!this.#bearList) {
      this.#bearList = await getBears()
    }
    callback.call(
      this,
      this.#bearList
        ?.filter((item) => {
          if (query?.reserve && !item.in_reserve) {
            return false
          }
          return true
        })
        .filter((item) => {
          if (query?.selection === "accepted") {
            return this.#bearStatus.accepted.includes(item.id)
          } else if (query?.selection === "rejected") {
            return this.#bearStatus.rejected.includes(item.id)
          } else {
            return ![
              ...this.#bearStatus.accepted,
              ...this.#bearStatus.rejected,
            ].includes(item.id)
          }
        })
    )
  }

  /**
   *
   * @param {number} id
   * @param {function} callback
   */
  async getBear(id, callback) {
    if (!this.#bearItems[id]) {
      this.#bearItems[id] = await getBearById(id)
    }
    callback.call(this, this.#bearItems[id])
  }

  /**
   *
   * @param {number} id
   * @param {function} callback
   */
  async acceptBear(id, callback) {
    const result = await acceptBear(id)
    const isSuccess = result?.success
    if (isSuccess) {
      this.#bearStatus.accepted = [...this.#bearStatus.accepted, id]
    }
    callback.call(this, isSuccess)
  }

  /**
   *
   * @param {number} id
   * @param {function} callback
   */
  async rejectBear(id, callback) {
    const result = await rejectBear(id)
    const isSuccess = result?.success
    if (isSuccess) {
      this.#bearStatus.rejected = [...this.#bearStatus.rejected, id]
    }
    callback.call(this, isSuccess)
  }
}

export default new Store()
