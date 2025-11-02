import { setSearchParam, srchP } from "./utils/url"
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
  }

  init() {
    this.#view.render("reserveCheckbox", srchP("reserve") === "true")
    this.#view.render("typeSelector", srchP("selection") ?? "incoming")
    this.#view.loadBears()
  }

  updateList() {
    this.#view.loadBears()
  }
}

export default Controller
