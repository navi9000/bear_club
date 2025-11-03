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
  #onlyInReserve = false

  async getBears() {
    if (!this.#bearList) {
      const bearList = await getBears()
      if (bearList) {
        this.#bearList = bearList
      }
    }
    return this.#bearList
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
