/**
 * @typedef {Object} Bear
 * @property {number} id
 * @property {string} image_url
 * @property {string} name
 * @property {string=} text
 * @property {string} type
 * @property {string} gender
 * @property {boolean} in_reserve
 */

/**
 * @typedef {"pageTitle" | "reserveCheckbox" | "typeSelector" | "bearList" | "modal" | "removeCard" | "alert"} ViewName
 */

/**
 * @typedef {"toggleReserve" | "selectType" | "acceptBear" | "rejectBear" | "openModal" | "closeModalAccept" | "closeModalReject" | "closeModalCancel" | "clickLogo"} ProjectEvent
 */

/**
 * @typedef {"incoming" | "accepted" | "rejected"} BearGroup
 */

/**
 * @typedef {"reserve" | "selection" | "open"} ProjectSearchParam
 */
