import Controller from "./Controller"
import { on } from "./utils/dom"
import Model from "./Model"
import View from "./View"

class App {
  #model
  #view
  #controller
  constructor() {
    this.#model = new Model()
    this.#view = new View()
    this.#controller = new Controller(this.#model, this.#view)

    on(window, "DOMContentLoaded", this.#controller.init.bind(this.#controller))
  }
}

export default App
