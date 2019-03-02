import Cookie from 'vue-cookie'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    SomeDate: 'defaultValue'
  },
  getters: {
    SomeDate: state => state.SomeDate // SomeDate: (state, getters, rootState) => {
  },
  mutations: {
    GET_TEMP (state, response) { // response: [object]
      state.SomeDate = response
      // other sync event here
    }
  },
  actions: {
    // cxt = { state, dispatch, rootState }
    // params: [object|string] (params 不建议绑定组件实例，这违背了Vuex管理状态的理念)
    GetTemp (cxt, params) {
      // ajax & async event here
      cxt.commit('GET_TEMP', params)
    },
    GetTemp_sync (cxt, params) { // 外部使用 .then 的情况则使用 sync 函数
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    }
  }
}
