import "./utils/types"
import Template from "./Template"
import store from "./Store"
import { on, qs } from "./utils/dom"
import { parseSearchParams, setSearchParam } from "./utils/url"

class App {
  #store
  constructor() {
    this.#store = store
    const bearList = qs(".list")
    const isReserveCheckbox = qs("#is-reserve")
    const typeSelector = qs("#type-selector")

    window.addEventListener("change", () => {
      console.log(window.location.href)
    })

    on(isReserveCheckbox, "change", (e) => {
      const value = e.target.checked
      setSearchParam("reserve", value)
    })

    on(typeSelector, "change", (e) => {
      const value = e.target.value
      setSearchParam("selection", value)
    })

    const loadPage = () => {
      this.#store.getBears().then((res) => {
        if (res) {
          bearList.innerHTML = res
            .filter((item) => {
              const { reserve, selection, opened } = parseSearchParams()
              if (reserve && !item.in_reserve) {
                return false
              }
              return true
            })
            .map((item) => Template.renderCard(item))
            .join("")
        }
      })
    }

    on(window, "load", loadPage)
    on(window, "change", loadPage)
  }
}

export default App
