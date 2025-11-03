import "./utils/types"

export default class Template {
  static #CardTemplate() {
    return `
        <li class="card {{card_style}}" data-id="{{id}}">
          <div class="card__image">
            <img src="{{img_src}}" alt="image"></img>
            {{in_reserve_marker}}
          </div>
          <div class="card__datawrapper">
            <div class="card__descwrapper">
              <p class="card__name">{{name}}</p>
              <div class="card__linewrapper">
                <p>{{type}}</p>
                <p>{{gender}}</p>
              </div>
            </div>
            {{button_wrapper}}
          </div>
        </li>
    `
  }

  static #CardTemplateEmptyList() {
    return `<li class="card-error-message">Список пуст</li>`
  }

  static #CardTemplateError() {
    return `<li class="card-error-message">Не удалось загрузить данные. Попробуйте позже</li>`
  }

  static #CardButtonWrapperTemplate() {
    return `
      <div class="card__buttonwrapper">
        <button class="button {{accept_button_style}}" data-type="accept">Принять</button>
        <button class="button {{reject_button_style}}" data-type="reject">Отклонить</button>
      </div>
    `
  }

  /**
   *
   * @param {Bear} bear
   */
  static renderCard({ id, image_url, name, type, gender, in_reserve }) {
    let cardTemplate = this.#CardTemplate()
      .replace("{{id}}", id.toString())
      .replace("{{card_style}}", in_reserve ? "card_inreserve" : "card_default")
      .replace("{{img_src}}", image_url)
      .replace(
        "{{in_reserve_marker}}",
        in_reserve
          ? "<div class='card__inreservelabel'>В заповеднике</div>"
          : ""
      )
      .replace("{{name}}", name)
      .replace("{{type}}", type)
      .replace("{{gender}}", gender)
      // позже будет условие
      .replace("{{button_wrapper}}", this.renderCardButtons(in_reserve))

    return cardTemplate
  }

  static renderEmptyList() {
    return this.#CardTemplateEmptyList()
  }

  static renderListError() {
    return this.#CardTemplateError()
  }

  /**
   *
   * @param {boolean} in_reserve
   */
  static renderCardButtons(in_reserve) {
    let buttonTemplate = this.#CardButtonWrapperTemplate()
      .replace("{{accept_button_style}}", "button_primary")
      .replace(
        "{{reject_button_style}}",
        in_reserve ? "button_secondary button_withborder" : "button_secondary"
      )

    return buttonTemplate
  }

  /**
   *
   * @param {string=} selection
   */
  static renderPageTitle(selection) {
    if (selection === "accepted") {
      return "Принятые медведи"
    } else if (selection === "rejected") {
      return "Отклоненные медведи"
    } else {
      return "Поступившие заявки"
    }
  }
}
