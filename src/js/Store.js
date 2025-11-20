import "./utils/types"
import { getBears, getBearById, acceptBear, rejectBear } from "./utils/http"

class Store {
  /**
   * @type {[Bear]=}
   */
  #bearList
  #bearItems = {}

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
   * @param {function} callback
   */
  #addBearToDB(id, status, callback) {
    if (!this.#db) {
      return
    }

    const transaction = this.#db.transaction([this.#DB_STORE], "readwrite")
    const objectStore = transaction.objectStore(this.#DB_STORE)

    const operation = objectStore.add({ id, status })

    operation.onerror = () => {
      console.error("Failed to save a bear")
    }

    operation.success = () => {
      callback.call(this, { id, status })
    }
  }

  /**
   *
   * @param {function} callback
   */
  #readDB(callback) {
    if (!this.#db) {
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
      })
    }

    operation.onerror = () => {
      console.error("Failed to read the database")
    }
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

    this.#readDB((bearIdListInDB) => {
      if (!bearIdListInDB) {
        return
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
              return bearIdListInDB.accepted.includes(item.id)
            } else if (query?.selection === "rejected") {
              return bearIdListInDB.rejected.includes(item.id)
            } else {
              return ![
                ...bearIdListInDB.accepted,
                ...bearIdListInDB.rejected,
              ].includes(item.id)
            }
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
    if (!isSuccess) {
      callback.call(this, isSuccess)
      return
    }
    this.#addBearToDB(id, "accepted", () => {
      callback.call(this, isSuccess)
    })
  }

  /**
   *
   * @param {number} id
   * @param {function} callback
   */
  async rejectBear(id, callback) {
    const result = await rejectBear(id)
    const isSuccess = result?.success
    if (!isSuccess) {
      callback.call(this, isSuccess)
      return
    }
    this.#addBearToDB(id, "rejected", () => {
      callback.call(this, isSuccess)
    })
  }
}

export default new Store()
