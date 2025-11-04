import { qs, on, delegate } from "./utils/dom"
import Template from "./Template"

class View {
  constructor() {
    this.$pageTitle = qs(".controls__title")
    this.$isReserve = qs("#is-reserve")
    this.$group = qs("#type-selector")
    this.$bearList = qs(".list")
    this.$modal = qs(".modal")
  }

  render(viewName, value) {
    switch (viewName) {
      case "pageTitle":
        this.$pageTitle.innerHTML = Template.renderPageTitle(value)
      case "reserveCheckbox":
        this.$isReserve.checked = value
        break
      case "typeSelector":
        this.$group.value = value
        break
      case "bearList":
        this.$bearList.innerHTML = this.#getBearList(value)
        break
      case "modal":
        this.$modal.innerHTML = this.#getModal(value)
        break
      case "modalState":
        this.$modal.open = !!value
        break
      default:
        console.warn("Unknown view: ", viewName)
    }
  }

  bind(event, handler) {
    switch (event) {
      case "toggleReserve":
        on(this.$isReserve, "change", handler)
        break
      case "selectType":
        on(this.$group, "change", handler)
        break
      case "acceptBear":
        delegate(this.$bearList, "[data-type='accept']", "click", handler)
        break
      case "rejectBear":
        delegate(this.$bearList, "[data-type='reject']", "click", handler)
        break
      case "openModal":
        delegate(this.$bearList, ".card", "click", handler)
        break
      case "closeModalAccept":
        delegate(this.$modal, "[data-type='accept']", "click", handler)
        break
      case "closeModalReject":
        delegate(this.$modal, "[data-type='reject']", "click", handler)
        break
      case "closeModalCancel":
        delegate(this.$modal, ".cancel-button", "click", handler)
        break
      default:
        console.warn("Unknown event: ", event)
    }
  }

  /**
   *
   * @param {[Bear]=} value
   */
  #getBearList(value) {
    if (!value) {
      return Template.renderListError()
    } else if (value.length === 0) {
      return Template.renderEmptyList()
    } else {
      return value.map((item) => Template.renderCard(item)).join("")
    }
  }

  /**
   *
   * @param {Bear=} bear
   */
  #getModal(bear) {
    if (!bear) {
      return ""
    } else {
      return Template.renderModal(bear)
    }
  }
}

export default View
