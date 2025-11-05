import store from "./Store"
import { getSP, setSP } from "./utils/url"

class Controller {
  #view
  /**
   *
   * @param {import("./View").default} view
   */
  constructor(view) {
    this.#view = view

    this.#view.bind("toggleReserve", (params) => {
      this.#toggleReserve(params)
    })
    this.#view.bind("selectType", (params) => {
      this.#selectType(params)
    })
    this.#view.bind("acceptBear", (id) => {
      this.#acceptBear(id)
    })
    this.#view.bind("rejectBear", (id) => {
      this.#rejectBear(id)
    })
    this.#view.bind("openModal", (id) => {
      this.#openModal(id)
    })
    this.#view.bind("closeModalAccept", (params) => {
      this.#closeModalAccept(params)
    })
    this.#view.bind("closeModalReject", (params) => {
      this.#closeModalReject(params)
    })
    this.#view.bind("closeModalCancel", () => {
      this.#closeModalCancel()
    })
  }

  async init() {
    const selection = getSP("selection")
    const reserve = getSP("reserve") === "true"
    const openID = getSP("open")

    this.#view.render("pageTitle", selection)
    this.#view.render("reserveCheckbox", reserve)
    this.#view.render("typeSelector", selection)
    store.getBears({ reserve, selection }, (list) => {
      this.#view.render("bearList", list)
      if (openID) {
        store.getBear(openID, (bear) => {
          this.#view.render("modal", bear)
        })
      }
    })
  }

  /**
   * @deprecated
   */
  async #loadBearList() {
    store.getBears(
      { reserve: getSP("reserve") === "true", selection: getSP("selection") },
      (list) => {
        this.#view.render("bearList", list)
      }
    )
  }

  async #toggleReserve({ reserve, selection }) {
    this.#view.render("reserveCheckbox", reserve)
    store.getBears({ reserve, selection }, (list) => {
      this.#view.render("bearList", list)
    })
  }

  async #selectType({ reserve, selection }) {
    this.#view.render("pageTitle", selection)
    store.getBears({ reserve, selection }, (list) => {
      this.#view.render("bearList", list)
    })
  }

  async #acceptBear(id) {
    store.acceptBear(id, (isSuccess) => {
      if (!isSuccess) {
        alert("Failed to update. Please try again later")
      } else {
        this.#loadBearList()
      }
    })
  }

  async #rejectBear(id) {
    store.rejectBear(id, (isSuccess) => {
      if (!isSuccess) {
        alert("Failed to update. Please try again later")
      } else {
        this.#loadBearList()
      }
    })
  }

  async #openModal(id) {
    store.getBear(id, (bear) => {
      this.#view.render("modal", bear)
    })
  }

  async #closeModalAccept({ id, reserve }) {
    store.acceptBear(id, (isSuccess) => {
      if (!isSuccess) {
        alert("Failed to update. Please try again later")
      } else {
        store.getBears({ reserve }, (list) => {
          this.#view.render("bearList", list)
          this.#view.render("modal", undefined)
        })
      }
    })
  }

  async #closeModalReject(id) {
    store.rejectBear(id, (isSuccess) => {
      if (!isSuccess) {
        alert("Failed to update. Please try again later")
      } else {
        store.getBears({ reserve }, (list) => {
          this.#view.render("bearList", list)
          this.#view.render("modal", undefined)
        })
      }
    })
  }

  #closeModalCancel() {
    this.#view.render("modal", undefined)
  }
}

export default Controller
