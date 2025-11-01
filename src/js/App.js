import { on } from "./utils/dom"
import View from "./View"

class App {
  #view
  constructor() {
    this.#view = new View()

    on(window, "load", this.#view.loadPage.bind(this.#view))
    on(window, "change", this.#view.loadPage.bind(this.#view))
  }
}

export default App
