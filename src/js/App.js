import "./utils/types"
import Template from "./Template"
import store from "./Store"
import { on, qs } from "./utils/dom"
import { setSearchParam } from "./utils/url"

class App {
  #store
  constructor() {
    this.#store = store
    const bearList = qs(".list")
    const isReserveCheckbox = qs("#is-reserve")
    const typeSelector = qs("#type-selector")

    on("change", isReserveCheckbox, (e) => {
      const value = e.target.checked
      setSearchParam("reserve", value)
    })

    on("change", typeSelector, (e) => {
      const value = e.target.value
      setSearchParam("selection", value)
    })

    this.#store.getBears().then((res) => {
      if (res) {
        bearList.innerHTML = res
          .map((item) => Template.renderCard(item))
          .join("")
      }
    })
  }
}

export default App
