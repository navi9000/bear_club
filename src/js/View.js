import { qs, on, qsa, clearSavedListeners } from "./utils/dom"
import store from "./Store"
import { parseSearchParams } from "./utils/url"
import Template from "./Template"

class View {
  constructor() {
    this.$bearList = qs(".list")
    this.$isReserve = qs("#is-reserve")
    this.$group = qs("#type-selector")
  }

  render(viewName, value) {
    switch (viewName) {
      case "reserveCheckbox":
        this.$isReserve.checked = value
        break
      case "typeSelector":
        console.log({ value })
        this.$group.value = value
    }
  }

  bind(event, handler) {
    switch (event) {
      case "toggleReserve":
        on(this.$isReserve, "change", handler)
        break
      case "selectType":
        on(this.$group, "change", handler)
    }
  }

  async loadBears() {
    clearSavedListeners()
    const bearList = await store.getBears()
    if (bearList) {
      this.$bearList.innerHTML = bearList
        .filter((item) => {
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
        .map((item) => Template.renderCard(item))
        .join("")
    }

    const cardList = qsa(".card", this.$bearList)
    cardList.forEach((card) => {
      const id = +card.attributes["data-id"].value
      const [$acceptButton, $rejectButton] = qsa(
        `[data-id="${id}"] button`,
        this.$bearList
      )
      if ($acceptButton) {
        on(
          $acceptButton,
          "click",
          () => {
            store.acceptBear(id)
            this.loadBears()
          },
          true
        )
      }
      if ($rejectButton) {
        on(
          $rejectButton,
          "click",
          () => {
            store.rejectBear(id)
            this.loadBears()
          },
          true
        )
      }
    })
  }
}

export default View
