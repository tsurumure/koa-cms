import Rule from './valid_rule'

const ValueGroup = {
  isJSONempty (json) { return Rule.JsonEmpty.test(json) },
  isPhone (str) { return Rule.Phone.test(str) },
  isEmail (str) { return Rule.Email.test(str) },
  isUrl (str) { return Rule.Url.test(str) },
  isQQ (str) { return Rule.QQ.test(str) },
  isTelephone (str) { return Rule.Telephone.test(str) },
  isInt (str) { return Rule.Int.test(str) },
  /* 手机规则 */
  Phone () {
    return (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!this.isPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback(undefined)
      }
    }
  },
  /* 邮箱规则 */
  Email () {
    return (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!this.isEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback(undefined)
      }
    }
  },
  /* url规则 */
  Url () {
    return (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!this.isUrl(value)) {
        callback(new Error('请输入正确的网址'))
      } else {
        callback()
      }
    }
  },
  /* QQ账户规则 */
  QQ () {
    return (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!this.isQQ(value)) {
        callback(new Error('QQ账号为 5-11 位(数字)'))
      } else {
        callback()
      }
    }
  },
  Telephone () {
    return (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入联系电话'))
      } else if (!this.isTelephone(value)) {
        callback(new Error('联系电话只能包含“- 或 数字”'))
      } else {
        callback()
      }
    }
  },
  Int () {
    return (rule, value, callback) => {
      if (this.isInt(value)) {
        callback()
      } else {
        callback(new Error('只能为非 0 的正整数'))
      }
    }
  },
  // 判断 [新密码] 与 [确认密码] 是否不一致
  Confirm_diff ({ vm, title, formName, confirmName}) {
    return (rule, value, callback) => {
      if (value != '' && value !== vm[formName][confirmName]) {
        callback(new Error(`两次输入${title}不一致!`))
      } else {
        callback()
      }
    }
  },
  // 判断 [旧密码] 与 [新密码] 是否一致
  Confirm ({ vm, title, formName, confirmName}) {
    return (rule, value, callback) => {
      if (value != '' && value === vm[formName][confirmName]) {
        callback(new Error(`两次输入${title}不能一致!`))
      } else {
        callback()
      }
    }
  }

}
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$valid', { value: ValueGroup })
  }
}
