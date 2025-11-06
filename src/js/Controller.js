import { getSP } from "./utils/url"

class Controller {
  #model
  #view
  /**
   * @param {import ("./Model").default} model
   * @param {import("./View").default} view
   */
  constructor(model, view) {
    this.#model = model
    this.#view = view

    this.#view.bind("toggleReserve", this.#toggleReserve.bind(this))
    this.#view.bind("selectType", this.#selectType.bind(this))
    this.#view.bind("acceptBear", this.#acceptBear.bind(this))
    this.#view.bind("rejectBear", this.#rejectBear.bind(this))
    this.#view.bind("openModal", this.#openModal.bind(this))
    this.#view.bind("closeModalAccept", this.#closeModalAccept.bind(this))
    this.#view.bind("closeModalReject", this.#closeModalReject.bind(this))
    this.#view.bind("closeModalCancel", this.#closeModalCancel.bind(this))
  }

  init() {
    const selection = getSP("selection") ?? "incoming"
    const reserve = getSP("reserve") === "true"
    const openID = getSP("open")

    this.#view.render("pageTitle", selection)
    this.#view.render("reserveCheckbox", reserve)
    this.#view.render("typeSelector", selection)
    this.#model.read({ reserve, selection }, (list) => {
      this.#view.render("bearList", { list, selection })
      if (openID) {
        this.#model.read(openID, (bear) => {
          this.#view.render("modal", bear ? { bear, selection } : "error")
        })
      }
    })
  }

  #toggleReserve({ reserve, selection }) {
    this.#view.render("reserveCheckbox", reserve)
    this.#model.read({ reserve, selection }, (list) => {
      this.#view.render("bearList", { list, selection })
    })
  }

  #selectType({ reserve, selection }) {
    this.#view.render("pageTitle", selection)
    this.#model.read({ reserve, selection }, (list) => {
      this.#view.render("bearList", { list, selection })
    })
  }

  #acceptBear(id) {
    this.#model.update(id, "accept", (isSuccess) => {
      if (!isSuccess) {
        this.#view.render("alert")
      } else {
        this.#view.render("removeCard", id)
      }
    })
  }

  #rejectBear(id) {
    this.#model.update(id, "reject", (isSuccess) => {
      if (!isSuccess) {
        this.#view.render("alert")
      } else {
        this.#view.render("removeCard", id)
      }
    })
  }

  #openModal(id) {
    const selection = getSP("selection") ?? "incoming"

    this.#model.read(id, (bear) => {
      this.#view.render("modal", bear ? { bear, selection } : "error")
    })
  }

  #closeModalAccept(id) {
    this.#model.update(id, "accept", (isSuccess) => {
      if (!isSuccess) {
        this.#view.render("alert")
      } else {
        this.#view.render("removeCard", id)
        this.#view.render("modal", null)
      }
    })
  }

  #closeModalReject(id) {
    this.#model.update(id, "reject", (isSuccess) => {
      if (!isSuccess) {
        this.#view.render("alert")
      } else {
        this.#view.render("removeCard", id)
        this.#view.render("modal", null)
      }
    })
  }

  #closeModalCancel() {
    this.#view.render("modal", null)
  }
}

export default Controller
