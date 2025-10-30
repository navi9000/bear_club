import "./utils/types"
import Template from "./Template"

class App {
  constructor() {
    const [bearList] = document.getElementsByClassName("list")
    this.__TEMP_getData().then((res) => {
      if (res) {
        bearList.innerHTML = res
          .map((item) => Template.renderCard(item))
          .join("")
      }
    })
  }

  async __TEMP_getData() {
    try {
      const res = await fetch(
        "https://private-9d5e37a-testassignment.apiary-mock.com/get-bears"
      )
      if (!res.ok) {
        return
      }

      /**
       * @type {[Bear]}
       */
      const data = (await res.json()).results.data
      return data
    } catch {
      return
    }
  }
}

export default App
