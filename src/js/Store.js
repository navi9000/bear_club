import "./utils/types"
import { getBears, getBearById } from "./utils/http"

class Store {
  /**
   * @type {[Bear] | null}
   */
  #bearList = null
  #bearItems = {}
  #bearStatus = {
    accepted: [],
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
}

export default new Store()
