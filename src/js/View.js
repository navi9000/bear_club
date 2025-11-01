import { qs, on } from "./utils/dom"
import store from "./Store"
import { parseSearchParams, setSearchParam } from "./utils/url"
import Template from "./Template"

class View {
  constructor() {
    this.$bearList = qs(".list")
    this.$isReserve = qs("#is-reserve")
    this.$group = qs("#type-selector")

    on(this.$isReserve, "change", (e) => {
      const value = e.target.checked
      setSearchParam("reserve", value)
    })

    on(this.$group, "change", (e) => {
      const value = e.target.value
      setSearchParam("selection", value)
    })
  }

  async loadPage() {
    const bearList = await store.getBears()
    if (bearList) {
      this.$bearList.innerHTML = bearList
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
  }
}

export default View
