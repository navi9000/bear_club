import store from "./Store"
import { parseSearchParams, getSP, setSP } from "./utils/url"
import View from "./View"

class Controller {
  #view
  /**
   *
   * @param {View} view
   */
  constructor(view) {
    this.#view = view

    this.#view.bind("toggleReserve", (e) => {
      setSP("reserve", e.target.checked)
      this.#loadBearList()
    })
    this.#view.bind("selectType", (e) => {
      setSP("selection", e.target.value)
      this.#loadPageTitle()
      this.#loadCheckbox()
      this.#loadBearList()
    })
    this.#view.bind("acceptBear", (e) => {
      const card = e.target.closest(".card")
      const id = card.attributes["data-id"].value
      store.acceptBear(+id)
      this.#loadBearList()
    })
    this.#view.bind("rejectBear", (e) => {
      const card = e.target.closest(".card")
      const id = card.attributes["data-id"].value
      store.rejectBear(+id)
      this.#loadBearList()
    })
    this.#view.bind("openModal", (e) => {
      const card = e.target.closest(".card")
      const id = +card.attributes["data-id"].value
      setSP("open", id)
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
    this.#view.render(
      "bearList",
      (await store.getBears()).filter((item) => {
        const { reserve, selection, opened } = parseSearchParams()
        if (reserve && !item.in_reserve) {
          return false
        }

        if (!selection || selection === "incoming") {
          const { accepted, rejected } = store.getBearStatusList()
          const excludedList = [...accepted, ...rejected]
          if (excludedList.some((excludedId) => excludedId === item.id)) {
            return false
          }
        }
        return true
      })
    )
  }

  async #loadModal() {
    this.#view.render("modalState", getSP("open"))
    this.#view.render("modal", getSP("open"))
  }
}

export default Controller
