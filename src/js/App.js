import Controller from "./Controller"
import { on } from "./utils/dom"
import View from "./View"

class App {
  #view
  #controller
  constructor() {
    this.#view = new View()
    this.#controller = new Controller(this.#view)

    on(window, "DOMContentLoaded", this.#controller.init.bind(this.#controller))
    on(window, "change", this.#controller.updateList.bind(this.#controller))
  }
}

export default App
