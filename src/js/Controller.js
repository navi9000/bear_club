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

    this.#view.bind("toggleReserve", (e) => {
      setSP("reserve", e.target.checked)
      this.#loadCheckbox()
      this.#loadBearList()
    })
    this.#view.bind("selectType", (e) => {
      setSP("selection", e.target.value)
      this.#loadPageTitle()
      this.#loadCheckbox()
      this.#loadBearList()
    })
    this.#view.bind("acceptBear", (e) => {
      this.#updateBear(this.#cardId(e), "accept")
    })
    this.#view.bind("rejectBear", (e) => {
      this.#updateBear(this.#cardId(e), "reject")
    })
    this.#view.bind("openModal", (e) => {
      setSP("open", this.#cardId(e))
      this.#loadModal()
    })
    this.#view.bind("closeModalAccept", () => {
      store.acceptBear(+getSP("open"))
      setSP("open", null)
      this.#loadModal()
      this.#loadBearList()
    })
    this.#view.bind("closeModalReject", () => {
      store.rejectBear(+getSP("open"))
      setSP("open", null)
      this.#loadModal()
      this.#loadBearList()
    })
    this.#view.bind("closeModalCancel", () => {
      setSP("open", null)
      this.#loadModal()
    })
  }

  async init() {
    this.#loadPageTitle()
    this.#loadCheckbox()
    this.#loadTypeSelector()
    this.#loadBearList()
    this.#loadModal()
  }

  #cardId(event) {
    const card = event.target.closest(".card")
    const id = card.attributes["data-id"].value
    return +id
  }

  async #loadPageTitle() {
    this.#view.render("pageTitle", getSP("selection"))
  }

  async #loadCheckbox() {
    this.#view.render("reserveCheckbox", getSP("reserve") === "true")
  }

  async #loadTypeSelector() {
    this.#view.render("typeSelector", getSP("selection") ?? "incoming")
  }

  async #loadBearList() {
    store.getBears(
      { reserve: getSP("reserve") === "true", selection: getSP("selection") },
      (list) => {
        this.#view.render("bearList", list)
      }
    )
  }

  async #loadModal() {
    const id = getSP("open")
    store.getBear(id, (bear) => {
      this.#view.render("modal", bear)
      this.#view.render("modalState", id)
    })
  }

  /**
   *
   * @param {number} id
   * @param {"accept" | "reject"} type
   */
  async #updateBear(id, type) {
    if (type === "accept") {
      store.acceptBear(id, (isSuccess) => {
        if (!isSuccess) {
          alert("Failed to update. Please try again later")
        } else {
          this.#loadBearList()
        }
      })
    } else if (type === "reject") {
      store.rejectBear(id, (isSuccess) => {
        if (!isSuccess) {
          alert("Failed to update. Please try again later")
        } else {
          this.#loadBearList()
        }
      })
    }
  }
}

export default Controller
