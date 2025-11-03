import store from "./Store"
import { parseSearchParams, setSearchParam, srchP } from "./utils/url"
import View from "./View"

class Controller {
  #view
  /**
   *
   * @param {View} view
   */
  constructor(view) {
    this.#view = view

    this.#view.bind("toggleReserve", (e) =>
      setSearchParam("reserve", e.target.checked)
    )
    this.#view.bind("selectType", (e) =>
      setSearchParam("selection", e.target.value)
    )
    this.#view.bind("acceptBear", (e) => {
      const card = e.target.closest(".card")
      const id = card.attributes["data-id"].value
      store.acceptBear(+id)
      this.init()
    })
    this.#view.bind("rejectBear", (e) => {
      const card = e.target.closest(".card")
      const id = card.attributes["data-id"].value
      store.rejectBear(+id)
      this.init()
    })
    this.#view.bind("openModal", (e) => {
      const card = e.target.closest(".card")
      const id = +card.attributes["data-id"].value
      setSearchParam("open", id)
      this.init()
    })
  }

  async init() {
    this.#view.render("pageTitle", srchP("selection"))
    this.#view.render("reserveCheckbox", srchP("reserve") === "true")
    this.#view.render("typeSelector", srchP("selection") ?? "incoming")
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
    this.#view.render("modalState", srchP("open"))
    this.#view.render("modal", srchP("open"))
  }
}

export default Controller
