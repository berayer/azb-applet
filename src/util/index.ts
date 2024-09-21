/**
 * 正则表达式匹配订单或者条形码
 */
export const IS_ORDER_BARCODE = /^[A-Z]\d{11}_T\d{2}_\d{2}(\d{4})?$/
