import "./utils/types"
import { getBears, getBearById, acceptBear, rejectBear } from "./utils/http"

class Store {
  /**
   * @type {IDBDatabase?}
   */
  #db = null
  #DB_NAME = "BearClubDatabase"
  #DB_VERSION = "1"
  #DB_STORE = "bears"

  constructor() {
    const db = indexedDB.open(this.#DB_NAME, this.#DB_VERSION)

    db.onerror = () => {
      console.error("Failed to load the database")
    }

    db.onsuccess = (event) => {
      this.#db = event.target.result
    }

    db.onupgradeneeded = (event) => {
      const result = event.target.result
      const objectStore = result.createObjectStore(this.#DB_STORE, {
        keyPath: "id",
      })
      objectStore.createIndex("status", "status")
    }
  }

  /**
   *
   * @param {number} id
   * @param {"accepted" | "rejected"} status
   */
  #addBearToDB(id, status) {
    if (!this.#db) {
      return
    }

    const transaction = this.#db.transaction([this.#DB_STORE], "readwrite")
    const objectStore = transaction.objectStore(this.#DB_STORE)

    const operation = objectStore.add({ id, status })
  }

  /**
   * @param {[Bear]=} bearList
   * @param {function} callback
   */
  #readDB(bearList, callback) {
    if (!this.#db) {
      callback.call(this, undefined)
      return
    }
    if (!bearList) {
      callback.call(this, undefined)
      return
    }

    const transaction = this.#db.transaction([this.#DB_STORE], "readonly")
    const objectStore = transaction.objectStore(this.#DB_STORE)
    const operation = objectStore.getAll()

    operation.onsuccess = (event) => {
      const result = event.target.result

      callback.call(this, {
        accepted: result
          .filter((item) => item.status === "accepted")
          .map((item) => item.id),
        rejected: result
          .filter((item) => item.status === "rejected")
          .map((item) => item.id),
        incoming: bearList
          .filter((bear) => !result.some((item) => item.id === bear.id))
          .map((item) => item.id),
      })
    }

    operation.onerror = () => {
      console.error("Failed to read the database")
      callback.call(this, undefined)
    }
  }

  /**
   *
   * @param {object} query
   * @param {function} callback
   */
  async getBears(query, callback) {
    const bearList = await getBears()

    this.#readDB(bearList, (bearIdList) => {
      callback.call(
        this,
        bearList
          ?.filter((item) => {
            if (query?.reserve && !item.in_reserve) {
              return false
            }
            return true
          })
          .filter((item) => {
            const selection = query?.selection ?? "incoming"
            return bearIdList[selection].includes(item.id)
          })
      )
    })
  }

  /**
   *
   * @param {number} id
   * @param {function} callback
   */
  async getBear(id, callback) {
    callback.call(this, await getBearById(id))
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
      this.#addBearToDB(id, "accepted")
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
      this.#addBearToDB(id, "rejected")
    }
    callback.call(this, isSuccess)
  }
}

export default new Store()
