/** 统一错误码 */
export const ErrorCode = {
  // 通用
  SUCCESS:            { code: 0,     msg: '成功' },
  UNKNOWN:            { code: 9999,  msg: '未知错误' },
  PARAM_INVALID:      { code: 1001,  msg: '参数校验失败' },
  UNAUTHORIZED:       { code: 1002,  msg: '未登录或登录已过期' },
  FORBIDDEN:          { code: 1003,  msg: '无权限访问' },
  NOT_FOUND:          { code: 1004,  msg: '资源不存在' },
  RATE_LIMITED:       { code: 1005,  msg: '请求过于频繁，请稍后再试' },
  SIGN_INVALID:       { code: 1006,  msg: '签名验证失败' },

  // 用户
  USER_NOT_FOUND:     { code: 2001,  msg: '用户不存在' },
  USER_BANNED:        { code: 2002,  msg: '账号已被禁用' },
  WX_LOGIN_FAILED:    { code: 2003,  msg: '微信登录失败' },

  // 订单
  ORDER_NOT_FOUND:    { code: 3001,  msg: '订单不存在' },
  ORDER_STATUS_ERR:   { code: 3002,  msg: '订单状态不允许此操作' },
  ORDER_PRICE_ERR:    { code: 3003,  msg: '订单金额异常' },
  ORDER_STOCK_OUT:    { code: 3004,  msg: '库存不足' },

  // 支付
  PAY_FAILED:         { code: 4001,  msg: '支付失败' },
  PAY_AMOUNT_MISMATCH:{ code: 4002,  msg: '支付金额不匹配' },
  PAY_SIGN_FAILED:    { code: 4003,  msg: '支付签名验证失败' },

  // 退款
  REFUND_DUP:         { code: 5001,  msg: '请勿重复申请退款' },
  REFUND_NOT_FOUND:   { code: 5002,  msg: '退款申请不存在' },
  REFUND_STATUS_ERR:  { code: 5003,  msg: '退款状态不允许此操作' },

  // 员工
  EMP_NOT_FOUND:      { code: 6001,  msg: '员工不存在' },
  EMP_NOT_VERIFIED:   { code: 6002,  msg: '未完成员工认证' },
  DEPOSIT_NOT_PAID:   { code: 6003,  msg: '未缴纳保证金' },

  // 商品
  PRODUCT_NOT_FOUND:  { code: 7001,  msg: '商品不存在' },
  PRODUCT_OFFLINE:    { code: 7002,  msg: '商品已下架' },
};
