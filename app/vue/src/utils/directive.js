import Vue from 'vue'
Vue.directive('level', {
  // bind (绑定), inserted (绑定到节点),
  // update (组件更新), componentUpdated (组件更新完成),
  // unbind (解绑)
  update: function (el, binding) {
    let userInfo = binding.value
    if (userInfo.level_id != 1 && userInfo.level_id != 2) el.remove()
  }
})
