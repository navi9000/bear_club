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

  async getBears() {
    if (!this.#bearList) {
      const bearList = await getBears()
      if (bearList) {
        this.#bearList = bearList
      }
    }
    return this.#bearList
  }

  async getBear(id) {
    if (!this.#bearItems[id]) {
      const bear = await getBearById(id)
      console.log({ bear })
      if (bear) {
        this.#bearItems[id] = bear
      }
    }
    return this.#bearItems[id]
  }

  /**
   *
   * @param {number} id
   */
  async acceptBear(id) {
    this.#bearStatus.accepted = [...this.#bearStatus.accepted, id]
  }

  async rejectBear(id) {
    this.#bearStatus.rejected = [...this.#bearStatus.rejected, id]
  }

  getBearStatusList() {
    return this.#bearStatus
  }
}

export default new Store()
