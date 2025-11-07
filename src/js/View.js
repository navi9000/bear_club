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
    this.$logo = qs(".logo")
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
        this.$modal.innerHTML = this.#getModal(value)
        if (value) {
          this.$modal.showModal()
        } else {
          setSP("open", null)
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
          const id = this.#cardId(e)
          setSP("open", id)
          handler(id)
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
      case "clickLogo":
        on(this.$logo, "click", () => {
          setSP("reserve", null)
          setSP("selection", null)
          handler()
        })
      default:
        console.warn("Unknown event: ", event)
    }
  }

  /**
   *
   * @param {{list: [Bear], selection: string}=} value
   */
  #getBearList(value) {
    if (!value) {
      return Template.renderListError()
    } else if (value.list.length === 0) {
      return Template.renderEmptyList()
    } else {
      const showButtons = !["accepted", "rejected"].includes(value.selection)
      return value.list
        .map((item) => Template.renderCard(item, showButtons))
        .join("")
    }
  }

  /**
   *
   * @param {{bear: Bear, selection: string} | "error" | null} data
   */
  #getModal(data) {
    if (!data) {
      return ""
    } else if (data === "error") {
      return Template.renderModalError()
    } else {
      return Template.renderModal(data.bear, data.selection === "incoming")
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
