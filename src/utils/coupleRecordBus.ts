/**
 * 情侣「身体记录」在本页内的刷新信号。
 *
 * 经期与亲密记录都不推 WS 事件（私密账本不因对方点一下弹提醒），但同一页上的日历卡
 * 得在另一张卡写完立刻跟着变，否则「记完之后数字上出图标」这条要等重新进页才成立。
 * 写成功的卡派发，日历卡监听；不经过 store，也不出页面作用域。
 */
export const COUPLE_RECORD_CHANGED = 'arechat:couple-record-changed'

export function notifyCoupleRecordChanged() {
  window.dispatchEvent(new CustomEvent(COUPLE_RECORD_CHANGED))
}
