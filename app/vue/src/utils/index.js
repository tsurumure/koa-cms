
const ValueGroup = {
  _IEVersion () {
    var userAgent = navigator.userAgent
    var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // IE<11
    var isEdge = userAgent.indexOf('Edge') > -1 && !isIE // Edge
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    if (isIE) {
      var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      var fIEVersion = parseFloat(RegExp['$1'])
      if (fIEVersion == 7) { return 7 } else if (fIEVersion == 8) {
        return 8
      } else if (fIEVersion == 9) { return 9 } else if (fIEVersion == 10) {
        return 10
      } else { return 6 } // IE版本<=7
    } else if (isEdge) {
      return 'edge' // edge
    } else if (isIE11) {
      return 11 // IE11
    } else {
      return -1 // 不是ie浏览器
    }
  },
  _toTree (data, parentId = 0) {
    let node = [], temp
    for (let i in data) {
      if (data[i].pid == parentId) {
        node.push(data[i])
        temp = _.sortBy(this._toTree(data, data[i].id), ['sort'])
        if (temp.length > 0) {
          data[i].children = temp
        }
      }
    }
    return node
  },
  _childToParentsTree (data, childId = 0) {
    let node = []
    for (let i in data) {
      if (data[i].id == childId) {
        node.push(childId)
        node = node.concat(this._childToParentsTree(data, data[i].pid))
      }
    }
    return node
  }
}

export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$utils', { value: ValueGroup })
  }
}
