import "./utils/types"

class Store {
  #bearList = null
  #bearItems = {}
  #bearStatus = {
    accepted: [],
    rejected: [],
  }
  #onlyInReserve = false

  constructor() {}
}
