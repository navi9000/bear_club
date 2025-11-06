import { qs, on, delegate } from "./utils/dom"
import Template from "./Template"
import { getSP, setSP } from "./utils/url"
import "./utils/types"

class View {
  constructor() {
    this.$pageTitle = qs(".controls__title")
    this.$isReserve = qs("#is-reserve")
    this.$customCheckbox = qs(".customcheckbox")
    this.$group = qs("#type-selector")
    this.$bearList = qs(".list")
    this.$modal = qs(".modal")
  }

  /**
   *
   * @param {ViewName} viewName
   * @param {any} value
   */
  render(viewName, value = undefined) {
    switch (viewName) {
      case "pageTitle":
        this.$pageTitle.innerHTML = Template.renderPageTitle(value)
        break
      case "reserveCheckbox":
        this.$isReserve.checked = value
        this.$customCheckbox.classList = `customcheckbox${
          value ? " customcheckbox_checked" : ""
        }`
        break
      case "typeSelector":
        this.$group.value = value
        break
      case "bearList":
        this.$bearList.innerHTML = this.#getBearList(value)
        break
      case "modal":
        setSP("open", value?.id)
        this.$modal.innerHTML = this.#getModal(value)
        if (value) {
          this.$modal.showModal()
        } else {
          this.$modal.close()
        }
        break
      case "removeCard":
        this.#removeCard(value)
        break
      case "alert":
        alert("Failed to update. Please try again later.")
        break
      default:
        console.warn("Unknown view: ", viewName)
    }
  }

  /**
   *
   * @param {ProjectEvent} event
   * @param {function} handler
   */
  bind(event, handler) {
    switch (event) {
      case "toggleReserve":
        on(this.$isReserve, "change", (e) => {
          const reserve = e.target.checked
          setSP("reserve", reserve)
          handler({
            reserve,
            selection: getSP("selection"),
          })
        })
        break
      case "selectType":
        on(this.$group, "change", (e) => {
          const selection = e.target.value
          setSP("selection", selection)
          handler({
            reserve: getSP("reserve") === "true",
            selection,
          })
        })
        break
      case "acceptBear":
        delegate(this.$bearList, "[data-type='accept']", "click", (e) => {
          handler(this.#cardId(e))
        })
        break
      case "rejectBear":
        delegate(this.$bearList, "[data-type='reject']", "click", (e) => {
          handler(this.#cardId(e))
        })
        break
      case "openModal":
        delegate(this.$bearList, ".card", "dblclick", (e) => {
          handler(this.#cardId(e))
        })
        break
      case "closeModalAccept":
        delegate(this.$modal, "[data-type='accept']", "click", () => {
          handler(this.#modalId())
        })
        break
      case "closeModalReject":
        delegate(this.$modal, "[data-type='reject']", "click", () => {
          handler(this.#modalId())
        })
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
   * @param {Bear | "error" | null} bear
   */
  #getModal(bear) {
    if (!bear) {
      return ""
    } else if (bear === "error") {
      return Template.renderModalError()
    } else {
      return Template.renderModal(bear)
    }
  }

  /**
   * @param {Event} event
   */
  #cardId(event) {
    const card = event.target.closest(".card")
    const id = card.attributes["data-id"].value
    return +id
  }

  #modalId() {
    const id = getSP("open")
    if (id) {
      return +id
    }
  }

  /**
   *
   * @param {number} id
   */
  #removeCard(id) {
    const elem = qs(`.card[data-id="${id}"]`)
    if (elem) {
      this.$bearList.removeChild(elem)
    }
  }
}

export default View
